import { getAllCourse } from "@/app/data/course/get-all-courses"
import { PublicCourseCard, PublicCourseCardSkeleton } from "../_components/PublicCourseCard";
import { date } from "zod";
import { Suspense } from "react";

export default function PublicCoursesRoute() {
    return (
        <div className="container mt-5 mb-32 mx-auto px-4 md:px-6 lg:px-8">

            <div className="flex flex-col justify-center space-y-2 mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-center">Explore Courses</h1>
                <p className="mx-auto text-lg text-gray-600 dark:text-gray-300">
                    Discover our wide range of courses designed to help you achieve your learning goals.
                    Whether you're looking to develop new skills, advance your career, or explore a new subject,
                    we have something for everyone.
                </p>
            </div>

            <Suspense fallback={<LoadingSkeletonLayout/>}>
                <RenderCourses />
            </Suspense>

        </div>
    )
}

async function RenderCourses() {
    const courses = await getAllCourse();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {courses.map((course) => (
                <PublicCourseCard key={course.id} data={course}/>
            ))}
        </div>
    )
}

function LoadingSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Array.from({length: 9}).map((_, index) => (
                <PublicCourseCardSkeleton key={index} />
            ))}
        </div>
    )
}