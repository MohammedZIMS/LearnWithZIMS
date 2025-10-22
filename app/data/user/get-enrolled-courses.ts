// import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "./require-user";

export async function getEnrolledCourses() {
  const user = await requireUser();

  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      Course: {
        select: {
          id: true,
          title: true,
          description: true,
          smallDescription: true,
          level: true,
          slug: true,
          fileKey: true,
          module: {
            select: {
              id: true,
              title: true,
              position: true,
              lecture: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  position: true,
                  lectureProgress: {
                    select: {
                      id: true,
                      lectureId: true,
                      completed: true,
                    },
                  },
                },
              },
            },
          },
          ratings: {
            select: { rating: true },
          },
          category: true,
          price: true,
          duration: true,
        },
      },
    },
  });

  return data.map((item) => {
    const course = item.Course;
    const ratings = course.ratings ?? [];
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    return {
      ...item,
      Course: {
        ...course,
        averageRating,
        category: course.category ?? "Uncategorized",
        price: course.price ?? 0,
        duration: course.duration ?? 0,
      },
    };
  });
}

export type EnrolledCourseType = Awaited<ReturnType<typeof getEnrolledCourses>>[0];
