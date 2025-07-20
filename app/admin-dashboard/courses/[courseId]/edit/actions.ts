"use server";

import { requireAdmin } from "@/app/data/admin/require-asmin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { CourseSchem, CourseSchemType } from "@/lib/zodSchemas";

export async function  editCourse(data: CourseSchemType, courseId: string): Promise<ApiResponse> {
    const user = await requireAdmin();
    
    try {
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