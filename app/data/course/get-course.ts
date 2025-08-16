import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getIndividualCourse(slug: string) {
    const course = await prisma.course.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            title: true,
            description: true,
            fileKey: true,
            price: true,
            duration: true,
            level: true,
            category: true,
            smallDescription: true,
            updatedAt: true,
            createdAt: true,
            ratings: {
                select: {
                    rating: true
                },
            },
            module: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lecture: {
                        select: {
                            id: true,
                            title: true,
                            position: true,
                        },
                        orderBy: {
                            position: "asc",
                        }
                    },
                },
                orderBy: {
                    position: "asc",
                },
            },
        },
    });

    if (!course) {
        notFound();
    }

    // Calculate average rating
    const averageRating = course.ratings.length > 0 
        ? course.ratings.reduce((acc, curr) => acc + curr.rating, 0) / course.ratings.length
        : 0;

    

    // Return enriched course data
    return {
        ...course,
        averageRating,
        reviewCount: course.ratings.length,
        modules: course.module.map(mod => ({
            ...mod,
            lectures: mod.lecture
        }))
    };
}