"use server";

import { requireAdmin } from "@/app/data/admin/require-asmin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

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

export async function deleteCourse(courseId: string): Promise<ApiResponse> {

    const session = await requireAdmin();
    
    try {
        const req = await request();
        const decision = await aj.protect(req, {footprint: session.user.id});

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

        await prisma.course.delete({
            where: {
                id: courseId,
            },
        });

        revalidatePath("/admin-dashboard/courses");

        return {
            status: "success",
            message: "Course deleted successfully"
        }
        
    } catch (error) {
        return {
            status: "error",
            message: "Failed to delete course"
        }
    }
}