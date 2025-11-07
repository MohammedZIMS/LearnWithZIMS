import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourse } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { PublicCourseCard } from "../(mainLayout)/_components/PublicCourseCard";
import { CourseProgressCard } from "./_components/CourseProgressCard";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourse(),
    getEnrolledCourses(),
  ]);

  const availableCourses = courses.filter(
    (course) =>
      !enrolledCourses.some(({ Course: enrolled }) => enrolled.id === course.id)
  );

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <header className="flex flex-col gap-2 border-b pb-4 mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your enrolled and available courses in one place.
        </p>
      </header>

      {/* Enrolled Courses */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Enrolled Courses
            </h2>
            <p className="text-muted-foreground text-sm">
              Here you can see all the courses you have access to.
            </p>
          </div>
          {enrolledCourses.length > 0 && (
            <Link
              href="/courses"
              className={buttonVariants({ variant: "outline" })}
            >
              View All
            </Link>
          )}
        </div>

        {enrolledCourses.length === 0 ? (
          <EmptyState
            title="No courses purchased"
            description="You haven't purchased any courses yet."
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="flex flex-col gap-6">
            {enrolledCourses.map((course) => (
              <CourseProgressCard key={course.Course.id} data={course} />
            ))}
          </div>
        )}
      </section>

      {/* Available Courses */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Available Courses
            </h2>
            <p className="text-muted-foreground text-sm">
              Discover new courses to enhance your learning journey.
            </p>
          </div>
          {availableCourses.length > 0 && (
            <Link
              href="/courses"
              className={buttonVariants({ variant: "outline" })}
            >
              Browse All
            </Link>
          )}
        </div>

        {availableCourses.length === 0 ? (
          <EmptyState
            title="No courses available"
            description="You've already purchased all available courses."
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* show only 6 course */}
            {availableCourses.slice(0, 6).map((course) => (
              <PublicCourseCard key={course.id} data={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
