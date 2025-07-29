import { describe } from "node:test";
import { z } from "zod";

export const CourseLevel = ["Beginner", "Intermediate", "Advanced"] as const;
export type CourseLevelType = typeof CourseLevel[number];

export const CourseStatus = ["Draft", "Published", "Archived"] as const;
export type CourseStatusType = typeof CourseStatus[number];

export const courseCategories = [
    "Development",
    "Business",
    "IT & Software",
    "Office Productivity",
    "Personal Development",
    "Design",
    "Marketing",
    "Photography",
    "Music",
    "Health & Fitness",
    "Teaching & Academics",
] as const;
export type CourseCategoryType = typeof courseCategories[number];

export const CourseSchem = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters long" }).max(100, { message: "Title must be at least 3 characters long" }),
    description: z.string().min(3, { message: "Description must be at least 3 characters long" }),
    fileKey: z.string().min(1, { message: "File is required" }),
    price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
    duration: z.coerce.number().max(500, { message: "Duration must be at most 500 hours" }),
    level: z.enum(CourseLevel, { message: "Level is required" }),
    category: z.enum(courseCategories, {message: "Category is required"}),
    smallDescription: z.string().min(3, { message: "Small description must be at least 3 characters long" }).max(400, { message: "Small description must be at most 200 characters long" }),
    slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
    status: z.enum(CourseStatus, { message: " Status is required" }),
});

export const moduleSchema = z.object({
    name: z.string().min(3, {message: "Name must be at least 3 characters long"}),
    courseId: z.string().uuid({message: "Invalid course id"}),

})

export const lectureSchema = z.object({
    name: z.string().min(3, {message: "Name must be at least 3 characters long"}),
    courseId: z.string().uuid({message: "Invalid course id"}),
    moduleId: z.string().uuid({message: "Invalid module id"}),
    description: z.string().min(3, {message: "Description must be at least 3 characters long"}).optional(),
    thumbnailKey: z.string().optional(),
    videoUrl: z.string().optional(),
    documentUrl: z.string().optional(),

})

export type CourseSchemType = z.infer<typeof CourseSchem>;
export type ModuleSchemaType = z.infer<typeof moduleSchema>;
export type LectureSchemaType = z.infer<typeof lectureSchema>;
