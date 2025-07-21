"use server";

import { requireAdmin } from "@/app/data/admin/require-asmin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { CourseSchem, CourseSchemType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
    detectBot({
        mode: "LIVE",
        allow: [],
    })
).withRule(
    fixedWindow({
        mode: "LIVE",
        window: "1m",
        max: 5,
    })
);

export async function  editCourse(data: CourseSchemType, courseId: string): Promise<ApiResponse> {
    const user = await requireAdmin();
    
    try {
        const req = await request();
        const decision = await aj.protect(req, {footprint: user.user.id});

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "You have been blocked due to rate limiting"
                }
            } else {

                return {
                    status: "error",
                    message: "You are a bot! if this a mistake contact our support",
                }
            }
        }

        const result = CourseSchem.safeParse(data);

        if(!result.success){
            return {
                status: "error",
                message: "Invalid data",
            };
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId: user.user.id,
            },
            data: {
                ...result.data,
            },
        });

        return {
            status: "success",
            message: "Course updated successfully",
        }
    } catch (error) {
        return {
            status: "error",
            message: "Failed to update course"
        }
    }
}