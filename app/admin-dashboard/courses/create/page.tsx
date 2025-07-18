"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { courseCategories, CourseLevel, CourseSchem, CourseSchemType, CourseStatus } from "@/lib/zodSchemas";
import { ArrowLeft, Loader2, PlusIcon, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransition } from "react";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/fileUploader/Uploader";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourse } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CourseCreatePage() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<CourseSchemType>({
        resolver: zodResolver(CourseSchem),
        defaultValues: {
            title: "",
            description: "",
            fileKey: "",
            price: 0,
            duration: 1,
            level: "Beginner",
            category: "Teaching & Academics",
            status: "Draft",
            slug: "",
            smallDescription: ""
        },
    });

    function onSubmit(values: CourseSchemType) {
        startTransition(async () => {
            const { data, error } = await tryCatch(CreateCourse(values));

            if (error) {
                toast.error("An unexpected error occurred while creating the course. Please try again.");
                return;
            }

            if (data.status === "success") {
                toast.success(data.message);
                form.reset();
                router.push("/admin-dashboard/courses");
            } else if (data.status === "error") {
                toast.error(data.message); // Fixed: Was incorrectly using toast.success
            }
        });
    }

    return (
        <div className="m-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin-dashboard/courses"
                    className={buttonVariants({ variant: "outline", size: "icon", className: "rounded-full" })}
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Create New Course</h1>
                    <p className="text-muted-foreground">Fill in the details below to create a new course</p>
                </div>
            </div>

            {/* Form Card */}
            <Card className="border-0 shadow-lg">
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <PlusIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <span>Course Information</span>
                    </CardTitle>
                    <CardDescription>Provide all necessary details for your new course</CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    <Form {...form}>
                        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>

                            {/* Title & Slug */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course Title <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter course title" {...field} className="py-6" disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course Slug <span className="text-red-500">*</span></FormLabel>
                                            <div className="flex gap-2">
                                                <FormControl>
                                                    <Input placeholder="e.g., web-development-bootcamp" {...field} className="py-6" disabled={isPending} />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="py-6 border-2 border-blue-600 text-primary"
                                                    disabled={isPending}
                                                    onClick={() => {
                                                        const titleValue = form.getValues("title");
                                                        if (titleValue) {
                                                            const slug = slugify(titleValue, { lower: true });
                                                            form.setValue("slug", slug, { shouldValidate: true });
                                                        }
                                                    }}
                                                >
                                                    <SparkleIcon className="size-4 mr-2" />
                                                    Generate
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Descriptions */}
                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="smallDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course Summary <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Brief course summary..." className="min-h-[100px] py-4" {...field} disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course Description <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <RichTextEditor field={field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Course Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                                                <FormControl>
                                                    <SelectTrigger className="py-6 w-full">
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courseCategories.map((category) => (
                                                        <SelectItem key={category} value={category} className="py-3">
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Difficulty Level <span className="text-red-500">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                                                <FormControl>
                                                    <SelectTrigger className="py-6 w-full">
                                                        <SelectValue placeholder="Select level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {CourseLevel.map((level) => (
                                                        <SelectItem key={level} value={level} className="py-3">
                                                            {level}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                                                <FormControl>
                                                    <SelectTrigger className="py-6 w-full">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {CourseStatus.map((status) => (
                                                        <SelectItem key={status} value={status} className="py-3">
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Price & Duration */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration (hours)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g., 12"
                                                    {...field}
                                                    className="py-6"
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price ($)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g., 49.99"
                                                    {...field}
                                                    className="py-6"
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Thumbnail Upload */}
                            <FormField
                                control={form.control}
                                name="fileKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course Thumbnail <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Actions */}
                            <div className="flex justify-between pt-6 border-t">
                                <Button type="button" variant="outline" className="px-8 py-6" onClick={() => form.reset()} disabled={isPending}>
                                    Reset Form
                                </Button>

                                <Button type="submit" className="px-8 py-6 dark:text-white" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" />
                                            Creating Course...
                                        </>
                                    ) : (
                                        <>
                                            Create Course <PlusIcon className="ml-2 size-5" />
                                        </>
                                    )}
                                </Button>
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}