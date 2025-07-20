import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-asmin";

export async function adminGetCourses() {
    await requireAdmin();

    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            duration: true,
            level: true,
            status: true,
            fileKey: true,
            price: true,
            category: true,
            slug: true,
        },
    });

    return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];