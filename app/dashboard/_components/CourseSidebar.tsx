"use client";

import { getCourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play } from "lucide-react";
import { LectureItem } from "./LectureItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-course-progress";

interface iAppProps {
    course: getCourseSidebarDataType["course"];
}

export function CourseSidebar({ course }: iAppProps) {

    const pathname = usePathname();
    const currentLectureId = pathname.split("/").pop();

    const { completedLecture, totalLectures, progressPercentage} = useCourseProgress({ courseData: course});

    return (
        <div className="flex flex-col h-full">
            <div className="pb-4 pr-4 border-b border-border">
                <div className="flex item-center gap-3 mb-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Play className="size-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-1">
                        <h1 className="font-semibold text-base leading-tight truncate-2">{course.title}</h1>
                        <p className="text-xs text-mutedforeground mt-1 truncate">{course.category}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{completedLecture}/{totalLectures} lecture</span>
                    </div>
                    <Progress value={progressPercentage} className="h-1.5"/>
                    <p className="text-muted-forgreground">{progressPercentage}% complete</p>
                </div>
            </div>

            <div className="py-4 pr-4 space-y-3">
                {course.module.map((module, index) => (
                    <Collapsible key={module.id} defaultOpen={index === 0}>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant={"outline"}
                                className="w-full p-3 h-auto flex item-center gap-2"
                            >
                                <div className="shrink-0">
                                    <ChevronDown className="size-4 text-primary" />
                                </div>

                                <div className="flex-1 text-left min-w-0">
                                    <p className="font-semibold text-sm truncate text-foreground">
                                        {module.position}: {module.title}
                                    </p>

                                    <p className="text-[10px] text-muted-foreground font-medium truncate">
                                        {module.lecture.length} Lectures
                                    </p>
                                </div>
                            </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
                            {module.lecture.map((lecture) => (
                                <LectureItem 
                                    key={lecture.id} 
                                    lecture={lecture} 
                                    slug={course.slug}  
                                    isActive={currentLectureId == lecture.id}
                                    completed={lecture.lectureProgress.find(
                                        (progress) => progress.lectureId === lecture.id
                                    ) ?.completed || false}
                                />
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    );
}