import { prisma } from "@/lib/db";
import { resolve } from "path";

export async function getAllCourse() {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const data = await prisma.course.findMany({
        where: {
            status: "Published",
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            title: true,
            price: true,
            smallDescription: true,
            slug: true,
            fileKey: true,
            level: true,
            id: true,
            duration: true,
            category: true,
            ratings: {
                select: {
                    rating: true,
                },
            },
        },
        
    });

    // Compute average rating for each course
    return data.map(course => {
        const ratings = course.ratings.map(r => r.rating);
        const averageRating = ratings.length
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;
        return {
            ...course,
            averageRating,
        };
    });
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourse>>[0];