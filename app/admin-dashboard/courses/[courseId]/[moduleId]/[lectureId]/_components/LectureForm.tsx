'use client';

import { AdminLectureType } from "@/app/data/admin/admin-get-lecture";
import { Uploader } from "@/components/fileUploader/Uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tryCatch } from "@/hooks/try-catch";
import { cn } from "@/lib/utils";
import { CourseSchemType, lectureSchema, LectureSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { startTransition, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateLecture } from "../action";
import { toast } from "sonner";
import router from "next/router";
import { redirect } from "next/navigation";

interface iAppProps {
    data: AdminLectureType;
    moduleId: string;
    courseId: string;
}

export function LectureForm({ moduleId, courseId, data }: iAppProps) {

    const [pending, startTransition] = useTransition()
    const form = useForm<LectureSchemaType>({
        resolver: zodResolver(lectureSchema),
        defaultValues: {
            name: data.title,
            courseId: courseId,
            moduleId: moduleId,
            description: data.description ?? undefined,
            thumbnailKey: data.thumbnailKey ?? undefined,
            documentUrl: data.documentUrl ?? undefined,
            videoUrl: data.videoUrl ?? undefined,
            type: data.type ?? undefined,
        },
    });

    async function onSubmit(values: LectureSchemaType) {
        startTransition(async () => {
            const {data: result, error } = await tryCatch(updateLecture(values, data.id));

            if (error) {
                toast.error("An unexpected error occurred. Please try again.");
                return;
            }

            if (result.status === "success") {
                toast.success(result.message);
                redirect(`/admin-dashboard/courses/${courseId}/edit`)
            } else if (result.status === 'error') {
                toast.error(result.message);
            }
        })
    }

    return (
        <div>
            <Link className={buttonVariants({ variant: "outline", className: "mb-6" })} href={`/admin-dashboard/courses/${courseId}/edit`}>
                <ArrowLeft className="size-4" />
                <samp>Go back</samp>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Lecture Configuration</CardTitle>
                    <CardDescription>
                        Configure the lecture item
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lecture Name: </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lecture name" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description: </FormLabel>
                                    <FormControl>
                                        <RichTextEditor field={field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="thumbnailKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thumbnail Image: </FormLabel>
                                    <FormControl>
                                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="image"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />


                            <FormField
                            control={form.control}
                            name="videoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Video: </FormLabel>
                                    <FormControl>
                                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="video"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />


                            <Button disabled={pending} type="submit">
                                {pending ? "Saving..." : "Save"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}