"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { CourseSchem, CourseSchemType } from "@/lib/zodSchemas";
import { headers } from "next/headers";

export async function CreateCourse(value: CourseSchemType): Promise<ApiResponse> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(), 
        });

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
