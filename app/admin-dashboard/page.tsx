import { ChartBarInteractive } from "@/components/sidebar/chart-bar-interactive"
import { SectionCards } from "@/components/sidebar/section-cards"
import { adminGetEnrollmentStats } from "../data/admin/admin-get-enrollment-stats"
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses"
import { Suspense } from "react"
import { AdminCourseCard } from "./courses/_components/AdminCourseCard"
import { EmptyState } from "@/components/general/EmptyState"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { RenderRecentCoursesSkeletonLayout } from "@/components/general/RenderRecentCoursesSkeletonLayout"

export default async function AdminIndexPage() {
  // Fetch enrollment data
  const enrollmentData = await adminGetEnrollmentStats()

  return (
    <div className="space-y-8">
      {/* Dashboard summary cards */}
      <SectionCards />

      {/* Enrollment chart */}
      <ChartBarInteractive data={enrollmentData} />

      {/* Recent courses section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link
            href="/admin-dashboard/courses"
            className={buttonVariants({ variant: "outline" })}
          >
            View All Courses
          </Link>
        </div>

        {/* Suspense for async loading */}
        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </div>
  )
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses()

  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create New Course"
        description="You don’t have any courses. Create some to see them here."
        title="No Courses Yet!"
        href="/admin-dashboard/courses/create"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course}/>
      ))}
    </div>
  )
}
