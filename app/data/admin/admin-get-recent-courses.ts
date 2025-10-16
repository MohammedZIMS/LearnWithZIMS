import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-asmin";

export async function adminGetRecentCourses() {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await requireAdmin();

    const data = await prisma.course.findMany({
        orderBy: { createdAt: "desc", },
        take: 2,
        select: {
            id: true,
            title: true,
            smallDescription: true,
            description: true,
            level: true,
            status: true,
            ratings: true,
            price: true,
            fileKey: true,
            slug: true,
            category: true,
            duration: true,
        },
    });

    return data;
}