"use client";

import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: EnrolledCourseType;
}

export function CourseProgressCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.Course.fileKey);
  const { totalLectures, completedLecture, progressPercentage } = useCourseProgress({
    courseData: data.Course,
  });

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={
          i < fullStars || (hasHalfStar && i === fullStars)
            ? "currentColor"
            : "none"
        }
        className={
          i < fullStars || (hasHalfStar && i === fullStars)
            ? "text-yellow-500"
            : "text-gray-300"
        }
      />
    ));
  };

  return (
    <Card className="flex-col sm:flex-row w-full rounded-xl overflow-hidden dark:bg-gray-900 bg-white shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
      {/* Thumbnail Section */}
      <div className="relative sm:w-1/3 w-full h-48 sm:h-auto">
        <Image
          src={thumbnailUrl}
          alt={`Thumbnail for ${data.Course.title}`}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-3 right-3 z-10 text-xs px-2 py-1 rounded-md">
          {data.Course.level}
        </Badge>
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between sm:w-2/3 w-full">
        <CardContent className="p-5 space-y-4">
          {/* Title */}
          <Link
            href={`/dashboard/${data.Course.slug}`}
            className="block font-semibold text-lg sm:text-xl line-clamp-2 hover:text-primary transition-colors"
          >
            {data.Course.title}
          </Link>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {data.Course.smallDescription}
          </p>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <p className="font-medium text-gray-700">Progress</p>
              <p className="text-xs text-muted-foreground">
                {completedLecture}/{totalLectures} completed
              </p>
            </div>
            <Progress value={progressPercentage} />
            <p className="text-xs text-gray-500">{progressPercentage}% complete</p>
          </div>

          {/* Rating */}
          <div className="flex items-center text-yellow-500">
            {renderStars(data.Course.averageRating)}
            <span className="ml-1 text-sm text-gray-500">
              ({data.Course.averageRating.toFixed(1)})
            </span>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-between items-center px-5 py-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <span className="text-xl font-bold text-blue-600">
              {data.Course.price === 0 ? "Free" : `$${data.Course.price}`}
            </span>
            <p className="text-xs text-gray-500">Price</p>
          </div>
          <Link
            href={`/dashboard/${data.Course.slug}`}
            className={buttonVariants({ variant: "default" })}
          >
            Continue
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}
