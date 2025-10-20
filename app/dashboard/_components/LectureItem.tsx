import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Play } from "lucide-react";
import Link from "next/link";

interface iAppProps {
    lecture: {
        id: string;
        title: string;
        position: number;
        description: string | null;
    };
    slug: string;
}
export function LectureItem({ lecture, slug }: iAppProps) {

    const completed = true;

    return (
        <Link
            href={`/dashboard/${slug}/${lecture.id}`}
            className={buttonVariants({
                variant: completed ? "secondary" : "outline",
                className: cn("w-full h-auto justify-start transition-all", completed && "bg-green-100 dark:bg-green-900/30 borgder-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200"),
            })}
        >
            <div className="flex item-center gap-2.5 w-full min-w-0">
                <div className="shrink-0">
                    {completed ? (
                        <div className="size-5 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center">
                            <Check className="size-3 text-white" />
                        </div>
                    ) : (
                        <div
                            className={cn(
                                "size-5 rounded-full border-2 bg-background flex justify-center items-center"
                            )}
                        >
                            <Play className={cn("size-2.5 fill-current")} />
                        </div>
                    )}

                </div>

                <div className="flex-1 text-left min-w-0">

                    <p className={cn("font-medium text-xs truncate", completed && "text-green-800 dark:text-green-200")}>   
                        {lecture.position}. {lecture.title}
                    </p>
                    {completed && (
                        <p className="text-[10px] text-green-700 dark:text-green-300" >Completed</p>
                    )}
                </div>
            </div>

        </Link>
    )
}