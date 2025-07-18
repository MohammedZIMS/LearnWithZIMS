import { z } from "zod";

export const CourseLevel = ["Beginner", "Intermediate", "Advanced"] as const;
export type CourseLevelType = typeof CourseLevel[number];

export const CourseStatus = ["Draft", "Published", "Archived"] as const;
export type CourseStatusType = typeof CourseStatus[number];

export const courseCategories = [
    "Development: Web or Mobile Development",
    "Business: Finance, Entrepreneurship",
    "IT & Software: Networking, Security, etc",
    "Office Productivity",
    "Personal Development",
    "Design: Graphic or UX/UI Design",
    "Marketing: Digital or Social Media Marketing",
    "Photography: Digital Photography, Photo Editing",
    "Music: Instrument, Music Production",
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

export type CourseSchemType = z.infer<typeof CourseSchem>;
