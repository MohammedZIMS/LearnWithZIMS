import { getAllCourse } from "@/app/data/course/get-all-courses"
import { PublicCourseCard } from "../_components/PublicCourseCard";
import { date } from "zod";

export default function PublicCoursesRoute() {
    return (
        <div className="mt-5 mb-32">

            <div className="flex flex-col justify-center space-y-2 mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-center">Explore Courses</h1>
                <p className="mx-auto px-4 text-lg text-gray-600 dark:text-gray-300">
                    Discover our wide range of courses designed to help you achieve your learning goals.
                    Whether you're looking to develop new skills, advance your career, or explore a new subject,
                    we have something for everyone.
                </p>
            </div>

            <RenderCourses />

        </div>
    )
}

async function RenderCourses() {
    const courses = await getAllCourse();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 px-4">
            {courses.map((course) => (
                <PublicCourseCard key={course.id} data={course}/>
            ))}
        </div>
    )
}