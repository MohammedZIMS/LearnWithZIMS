// get-user-review.ts
import { prisma } from "@/lib/db";
import { requireUser } from "./require-user";

export async function getUserReview(courseId: string) {
  const user = await requireUser();

  // Get all ratings for the course
  const reviews = await prisma.rating.findMany({
    where: { courseId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews: reviews.length,
    reviews,
  };
}
