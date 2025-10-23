import { getLectureContent } from "@/app/data/course/get-lecture-content"
import { CourseContent } from "./_components/CourseContent";
import { Suspense } from "react";
import { LectureSkeleton } from "./_components/LectureSkeletion";

type Params = Promise<{ lectureId: string}>;

export default async function LectureContentPage({ params, }: { params: Params}) {
    const { lectureId } = await params;
    
    return (
        <Suspense fallback={<LectureSkeleton/>}>
            <LectureContentLoader lectureId={lectureId}/>
        </Suspense>
    )
}

async function LectureContentLoader({lectureId}: {lectureId: string} ) {
    const data = await getLectureContent(lectureId);
    return (
        <div>
            <CourseContent data={data}/>
        </div>
    )
}