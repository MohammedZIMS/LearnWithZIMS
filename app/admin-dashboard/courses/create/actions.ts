"use server";

import { requireAdmin } from "@/app/data/admin/require-asmin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/type";
import { CourseSchem, CourseSchemType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
    
    fixedWindow({
        mode: "LIVE",
        window: "1m",
        max: 5,
    })
);

export async function CreateCourse(value: CourseSchemType): Promise<ApiResponse> {
    try {
        const req = await request();
        const session = await requireAdmin();
        const decision = await aj.protect(req, {footprint: session.user.id});

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "You have been blocked due to rate limiting"
                }
            } else {

                return {
                    status: "error",
                    message: "You are a bot! if this a mistake contact our support",
                }
            }
        }

        if (!session?.user?.id) {
            return {
                status: "error",
                message: "Unauthorized: User not logged in",
            };
        }

        const validation = CourseSchem.safeParse(value);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data",
            };
        }

        const data = await stripe.products.create({
            name: validation.data.title,
            description: validation.data.description,
            default_price_data: {
                currency: "usd",
                unit_amount: validation.data.price * 100,
            },
        });
        await prisma.course.create({
            data: {
                ...validation.data,
                userId: session.user.id,
                stripePriceId: data.default_price as string,
            },
        });

        return {
            status: "success",
            message: "Course created successfully!",
        };

    } catch (error) {
        console.error("CreateCourse Error:", error);

        return {
            status: "error",
            message: "Failed to create course",
        };
    }
}
