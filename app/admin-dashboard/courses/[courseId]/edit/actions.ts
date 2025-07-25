"use server";

import { requireAdmin } from "@/app/data/admin/require-asmin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { CourseSchem, CourseSchemType, moduleSchema, ModuleSchemaType } from "@/lib/zodSchemas";
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

export async function reorderLecture(
    moduleId: string,
    lecture: {
        id: string;
        position: number
    }[],
    courseId: string,
): Promise<ApiResponse> {
    await requireAdmin();
    try {

        if (!lecture || lecture.length === 0) {
            return {
                status: "error",
                message: "No lecture provided for reordering",
            }
        }

        const updates = lecture.map((lecture) => prisma.lecture.update({
            where: {
                id: lecture.id,
                moduleId: moduleId,
            },
            data: {
                position: lecture.position,
            },
        }));


        await prisma.$transaction(updates);

        revalidatePath(`/admin-dashboard/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lecture reordered successfully!"
        }

    } catch (error) {
        return {
            status: "error",
            message: "Failed to reorder lecture"
        }
    }

}

export async function reorderModules(
    courseId: string,
    modules: { id: string; position: number}[]
): Promise<ApiResponse> {
    await requireAdmin();
    try {

        if (!modules || modules.length === 0) {
            return {
                status: 'error',
                message: "No module provided for reordering"
            };
        }

        const updates = modules.map((module) => prisma.module.update({
            where: {
                id: module.id,
                CourseId: courseId,
            },
            data: {
                position: module.position,
            },
        }));

        await prisma.$transaction(updates);

        revalidatePath(`/admin-dashboard/courses/${courseId}/edit`);

        return {
            status: 'success',
            message: "Module reordered successfully!"
        };
        
    } catch (error) {
        return {
            status: "error",
            message: "Failed to reorder module",
        }
    }
}

export async function createModule(
    values: ModuleSchemaType
): Promise<ApiResponse> {
    await requireAdmin();
    try {

        const result = moduleSchema.safeParse(values);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid data"
            };
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.module.findFirst({
                where: {
                    CourseId: result.data.courseId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: "desc"
                },
            });

            await tx.module.create({
                data: {
                    title: result.data.name,
                    CourseId: result.data.courseId,
                    position:( maxPos?.position ?? 0) + 1, 
                },
            });
        });

        revalidatePath(`/admin-dashboard/courses/${result.data.courseId}/edit`);
        
        return {
            status: "success",
            message: "Module create successfully!"
        };
    } catch (error) {
        return {
            status: "error",
            message: "Failed to create module"
        };
    }
}