"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { courseCategories, CourseLevel, CourseSchem, CourseSchemType, CourseStatus } from "@/lib/zodSchemas";
import { ArrowLeft, PlusIcon, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function CourseCreatePage() {

    const form = useForm<CourseSchemType>({
        resolver: zodResolver(CourseSchem),
        defaultValues: {
            title: "",
            description: "",
            fileKey: "",
            price: 0,
            duration: 0,
            level: "Beginner",
            category: "Teaching & Academics",
            status: 'Draft',
            slug: "",
            smallDescription: ""
        },
    });

    function onSubmit(values: CourseSchemType) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <>
            <div className="flex items-center gap-4">
                <Link
                    href={"/admin-dashboard/courses"}
                    className={buttonVariants({
                        variant: "outline",
                        size: "icon"
                    })}
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <h1 className="text-2xl font-bold text-center">Create Course</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Provide basic information about the course
                    </CardDescription>
                    <CardContent>
                        <Form {...form}>
                            <form
                                className="space-y-6"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course Title <samp className="text-red-500">*</samp></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your course title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex items-end gap-4">


                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Course Slug <samp className="text-red-500">*</samp></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Show your course slug" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        className="w-fit dark:text-white"
                                        onClick={() => {
                                            const titleValue = form.getValues("title");

                                            const slug = slugify(titleValue);

                                            form.setValue('slug', slug, { shouldValidate: true })
                                        }}
                                    >
                                        Ganerate Slug
                                        <SparkleIcon />
                                    </Button>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="smallDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course Summary</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter your course summary" {...field} />
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
                                            <FormLabel>Course Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter your course description..."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Course Category <samp className="text-red-500">*</samp></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {courseCategories.map((category) => (
                                                            <SelectItem key={category} value={category}>
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
                                                <FormLabel>Course Level <samp className="text-red-500">*</samp></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select level" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {CourseLevel.map((level) => (
                                                            <SelectItem key={level} value={level}>
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
                                        name="duration"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Duration (hourd)</FormLabel>
                                                <FormControl>
                                                    <Input type="numder" placeholder="Enter course duration" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Course Status <samp className="text-red-500">*</samp></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {CourseStatus.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {status}
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
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Course Price</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="fileKey"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course Thumbnail <samp className="text-red-500">*</samp></FormLabel>
                                            <FormControl>
                                                <Input type="file" accept="image/*" placeholder="Thumbnail url" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-between">
                                    <div>
                                        <Link href={'/admin-dashboard/courses/create'}>
                                            <Button className="bg-amber-200">
                                                Reset ↩
                                            </Button>
                                        </Link>
                                    </div>

                                    <Button>
                                        Create Course <PlusIcon className="ml-1"/>
                                    </Button>
                                </div>

                            </form>
                        </Form>
                    </CardContent>
                </CardHeader>
            </Card>
        </>
    )
}