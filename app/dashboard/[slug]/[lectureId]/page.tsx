import { getLectureContent } from "@/app/data/course/get-lecture-content"
import { CourseContent } from "./_components/CourseContent";

type Params = Promise<{ lectureId: string}>;

export default async function LectureContentPage({ params, }: { params: Params}) {
    const { lectureId } = await params;
    const data = await getLectureContent(lectureId);
    return (
        <div>
            <CourseContent data={data}/>
        </div>
    )
}