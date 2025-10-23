import { ReactNode } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { CourseReview } from "./[lectureId]/_components/CourseReview";

// interface iAppProps {
//     params: Promise<{ slug: string}>;
//     children: ReactNode;
// }

interface iAppProps {
  params: { slug: string };
  children: ReactNode;
}

export default async function CourseLayout({children, params}: iAppProps) {
    
    const { slug } = await params;

    // server-side security check and kightweight data fetching
    const course = await getCourseSidebarData(slug);
    return (
        <div>

        <div className="flex flex-1">

            {/* sidebar - 30% */}
            <div className="w-80 border-r border-border shrink-0">
                <CourseSidebar course={course.course}/>
            </div>

            {/* Main Content - 70% */}
            <div className="flex overflow-hidden">
                {children}
            </div>

        </div>
            {/* Review Render */}
            <div className="mt-8">
                <CourseReview courseId={course.course.id} />
            </div>

        </div>
    )
}