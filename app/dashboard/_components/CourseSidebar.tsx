import { getCourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play } from "lucide-react";

interface iAppProps {
    course: getCourseSidebarDataType["course"];
}

export function CourseSidebar({ course }: iAppProps) {
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
                        <span>4/10 lecture</span>
                    </div>
                    <Progress value={55} className="h-1.5"/>
                    <p className="text-muted-forgreground">55% complete</p>
                </div>
            </div>

            <div className="py-4 pr-4 space-y-3">
                {course.module.map((module) => (
                    <Collapsible key={module.id}>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant={"outline"}
                                className="w-full p-3 h-auto flex item-center gap-2"
                            >
                                <div className="shrink-0">
                                    <ChevronDown className="size-4 text-primary" />
                                </div>

                                <div className="flex-1 text-left min-w-0">
                                    <p className="">
                                        {module.position}: {module.title}
                                    </p>
                                </div>
                            </Button>
                        </CollapsibleTrigger>
                    </Collapsible>
                ))}
            </div>
        </div>
    );
}