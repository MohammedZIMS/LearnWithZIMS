"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { revalidatePath } from "next/cache";

export async function markLectureComplete(
  lectureId: string,
  slug: string
): Promise<ApiResponse> {
  try {
    const session = await requireUser();

    await prisma.lectureProgress.upsert({
      where: {
        userId_lectureId: {
          userId: session.id,
          lectureId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        userId: session.id,
        lectureId,
        completed: true,
      },
    });

    revalidatePath(`/dashboard/${slug}`);

    return {
      status: "success",
      message: "Lecture marked as complete.",
    };
  } catch (error) {
    console.error("Error marking lecture complete:", error);
    return {
      status: "error",
      message: "Failed to mark lecture as complete.",
    };
  }
}
