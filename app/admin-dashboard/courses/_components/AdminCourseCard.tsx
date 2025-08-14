import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { Badge } from "@/components/ui/badge";
import { DollarSign, EditIcon, Eye, MoreVertical, Pencil, School, TimerIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface iAppProps {
    data: AdminCourseType;
}

export function AdminCourseCard({ data }: iAppProps) {
    const thumbnail = useConstructUrl(data.fileKey);

    // Status badge styling
    const statusColors = {
        Draft: "bg-gray-100 text-gray-800 dark:bg-gray-700",
        Published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Archived: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    };

    // Level badge styling
    const levelColors = {
        Beginner: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        Intermediate: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
        Advanced: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
    };

    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-lg border-0 shadow-sm py-0 gap-0">
            <div className="flex flex-col md:flex-row">
                {/* Thumbnail Section - Left */}
                <div className="relative md:w-2/5 aspect-video overflow-hidden">
                    <div className="absolute top-3 left-3 z-10">
                        <Badge className={cn(
                            "px-2 py-1 text-xs font-medium rounded-md shadow",
                            statusColors[data.status as keyof typeof statusColors] || "bg-gray-100"
                        )}>
                            {data.status}
                        </Badge>
                    </div>
                    
                    <Image
                        src={thumbnail}
                        alt="Thumbnail Image"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/10 to-transparent md:hidden" />
                </div>

                {/* Content Section - Right */}
                <div className="flex-1 flex flex-col relative md:w-3/5">
                    {/* Action menu */}
                    <div className="absolute top-3 right-3 z-10">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    size={"icon"}
                                    className="size-8 rounded-full bg-background/80 backdrop-blur-sm shadow"
                                >
                                    <MoreVertical className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-lg border">
                                <DropdownMenuItem asChild className="px-3 py-2.5 cursor-pointer">
                                    <Link href={`/admin-dashboard/courses/${data.id}/edit`} className="flex items-center">
                                        <Pencil className="size-4 mr-2 text-muted-foreground" />
                                        Edit Course
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="px-3 py-2.5 cursor-pointer">
                                    <Link href={`/courses/${data.slug}`} className="flex items-center">
                                        <Eye className="size-4 mr-2 text-muted-foreground" />
                                        Preview
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1" />
                                <DropdownMenuItem asChild className="px-3 py-2.5 cursor-pointer text-destructive focus:bg-destructive/10">
                                    <Link href={`/admin-dashboard/courses/${data.id}/delete`} className="flex items-center">
                                        <Trash2 className="size-4 mr-2 text-destructive" />
                                        Delete
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <CardHeader className="py-4">
                        <Link
                            href={`/admin-dashboard/courses/${data.id}/edit`}
                            className="font-bold text-lg line-clamp-2 hover:underline hover:text-primary transition-colors"
                        >
                            {data.title}
                        </Link>
                        <p className="line-clamp-3 text-sm text-muted-foreground mt-1">
                            {data.smallDescription}
                        </p>
                    </CardHeader>

                    <CardContent className="py-2 pb-0">
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={cn(
                                "flex items-center gap-1",
                                levelColors[data.level as keyof typeof levelColors] || "bg-gray-100"
                            )}>
                                <School className="size-3.5" />
                                {data.level}
                            </Badge>

                            <Badge variant="secondary" className="flex items-center gap-1">
                                <span>{data.category}</span>
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm mb-3">
                            <div className="flex items-center text-muted-foreground">
                                <TimerIcon className="size-4 mr-1.5" />
                                <span>{data.duration} hours</span>
                            </div>

                            <div className="font-semibold flex items-center">
                                <DollarSign className="size-4 mr-1" />
                                {data.price > 0 ? `${data.price.toFixed(2)}` : "Free"}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-0 mt-auto">
                        <Link
                            href={`/admin-dashboard/courses/${data.id}/edit`}
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                                "w-full py-5 hover:bg-primary/10 group"
                            )}
                        >
                            Edit Course
                            <EditIcon className="size-4 ml-2" />
                        </Link>
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
}