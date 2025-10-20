// import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";
import { notFound } from "next/navigation";

export async function getLectureContent(lectureId: string) {
    const session = await requireUser();

    const lecture = await prisma.lecture.findUnique({
        where: {
            id: lectureId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            thumbnailKey: true,
            videoUrl: true,
            documentUrl: true,
            position: true,
            Module: {
                select: {
                    CourseId: true,
                },
            },
        },
    });

    if (!lecture) {
        return notFound();
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.id,
                courseId: lecture.Module.CourseId,
            },
        },
        select: {
            status: true,
        },
    });

    if (!enrollment || enrollment.status !== "Active") {
        return notFound()
    }

    return lecture;
}

export type LectureContentType = Awaited<ReturnType<typeof getLectureContent>>