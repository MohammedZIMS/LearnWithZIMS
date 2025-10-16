import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-asmin";

export async function adminGetEnrollmentStats() {
    await requireAdmin();

    const thirtyDaysAgo =new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const enrollments = await prisma.enrollment.findMany({
        where: {},
        select: { createdAt: true, },
        orderBy: { createdAt: "asc" },
    });

    const last30Days: {date: string; enrollments: number}[] = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date();

        date.setDate(date.getDate() - i);

        last30Days.push({
            date: date.toISOString().split("T")[0],
            enrollments: 0,
        });
    }
}