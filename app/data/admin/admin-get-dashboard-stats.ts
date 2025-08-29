import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-asmin";

export async function adminGetDashboardStats() {
    await requireAdmin();

    const [totalSignups, totalCustomers, totalCourses, totalLectures] = await Promise.all([
        // Total Signups
        prisma.user.count(),

        // Total Customers
        prisma.user.count({
            where: {
                enollment: {
                    some: {},
                },
            },
        }),

        // Total Courses
        prisma.course.count(),

        // Total Lectures
        prisma.lecture.count(),
    ]);

    return {
        totalSignups,
        totalCustomers,
        totalCourses,
        totalLectures,
    };
}