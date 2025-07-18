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

export async function CreateCourse(value: CourseSchemType): Promise<ApiResponse> {
    try {
        const req = await request();
        const session = await requireAdmin();
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

        if (!session?.user?.id) {
            return {
                status: "error",
                message: "Unauthorized: User not logged in",
            };
        }

        const validation = CourseSchem.safeParse(value);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data",
            };
        }

        const course = await prisma.course.create({
            data: {
                ...validation.data,
                userId: session.user.id,
            },
        });

        return {
            status: "success",
            message: "Course created successfully!",
        };

    } catch (error) {
        console.error("CreateCourse Error:", error);

        return {
            status: "error",
            message: "Failed to create course",
        };
    }
}
