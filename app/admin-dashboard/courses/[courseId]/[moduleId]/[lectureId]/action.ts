'use server';

import { requireAdmin } from "@/app/data/admin/require-asmin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { lectureSchema, LectureSchemaType } from "@/lib/zodSchemas";

export async function updateLecture(values: LectureSchemaType, lectureId: string): Promise<ApiResponse> {
    await requireAdmin()

    try {
        const result = lectureSchema.safeParse(values)

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid date"
            };
        }

        await prisma.lecture.update({
            where: {
                id: lectureId,
            },
            data: {
                title: result.data.name,
                description: result.data.description,
                thumbnailKey: result.data.thumbnailKey,
                videoUrl: result.data.videoUrl,
            },
        });

        return{
            status: "success",
            message: "Course updated successfully"
        }
        
    } catch (error) {
        return {
            status: "error",
            message: "Failed to update course"
        }
    }
}