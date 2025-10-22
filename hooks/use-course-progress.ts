"use client";

import { getCourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { useMemo } from "react";

interface iAppProps {
  courseData: getCourseSidebarDataType["course"];
}

interface CourseProgressResult {
  totalLectures: number;
  completedLecture: number;
  progressPercentage: number;
}

export function useCourseProgress({ courseData }: iAppProps): CourseProgressResult {
  return useMemo(() => {
    let totalLectures = 0;
    let completedLecture = 0;

    courseData.module.forEach((module) => {
      module.lecture.forEach((lecture) => {
        totalLectures++;

        // Check if this lecture is completed
        const isCompleted = lecture.lectureProgress.some(
          (progress) => progress.lectureId === lecture.id && progress.completed
        );

        if (isCompleted) {
          completedLecture++;
        }
      });
    });

    const progressPercentage =
      totalLectures > 0
        ? Math.round((completedLecture / totalLectures) * 100)
        : 0;

    return {
      totalLectures,
      completedLecture,
      progressPercentage,
    };
  }, [courseData]);
}
