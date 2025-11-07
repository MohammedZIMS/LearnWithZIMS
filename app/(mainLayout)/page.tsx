import { Suspense } from "react"
import { HeroSection } from "./_components/HeroSection"
import PopularCoursesServer from "./_components/PopularCoursesServer"
import { PublicCourseCardSkeleton } from "./_components/PublicCourseCard"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <HeroSection />

      <div className="space-y-6 mt-16 container mx-auto">

        <div className="flex items-center justify-between py-6">

          <h2 className="text-xl md:text-4xl font-bold tracking-tighter text-center">
            Explore Our Popular Courses
          </h2>

          <Link className={buttonVariants()} href={"/courses"}>
            Explore All Course
          </Link>
        </div>

        <Suspense fallback={<LoadingSkeletonLayout />}>
          <PopularCoursesServer />
        </Suspense>
      </div>
    </>
  )
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  )
}
