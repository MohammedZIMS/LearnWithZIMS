import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-asmin";
import { notFound } from "next/navigation";

export async function adminGetLecture(id: string) {
  await requireAdmin();

  const data = await prisma.lecture.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      videoUrl: true,
      thumbnailKey: true,
      documentUrl: true,
      position: true,
      type: true,
    },
  });

  if (!data) return notFound();

  return data;
}

export type AdminLectureType = Awaited<ReturnType<typeof adminGetLecture>>;