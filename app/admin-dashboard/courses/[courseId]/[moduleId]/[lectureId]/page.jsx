import { adminGetLecture } from "@/app/data/admin/admin-get-lecture";
import { LectureForm } from "./_components/LectureForm";

// type Params = Promise<{
//   courseId: string;
//   moduleId: string;
//   lectureId: string;
// }>;

// export default async function LectureIdPage({ params }: {params: Params}) {
export default async function LectureIdPage({ params }) {
  const { courseId, moduleId, lectureId } = await params; 
  const lecture = await adminGetLecture(lectureId);

  return (
    <LectureForm
      data={lecture}
      moduleId={moduleId}
      courseId={courseId}
    />
  );
}
