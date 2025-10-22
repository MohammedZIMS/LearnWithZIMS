import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";

interface iAppProps {
    params: Promise<{slug: string}>;
}
export default async function CourseSlugRoute({ params }: iAppProps) {
    const { slug } = await params;
    const course = await getCourseSidebarData(slug);

    const firstModule = course.course.module[0];
    const firstLecture = firstModule.lecture[0];

    if (firstLecture) {
        redirect(`/dashboard/${slug}/${firstLecture.id}`);
    }
    return (
        <div className="flex items-center justify-between h-full text-center">
            <h2 className="text-2xl font-bold mb-2">No Lexture available</h2>
            <p>This course does not have any lecture</p>
        </div>
    )
}