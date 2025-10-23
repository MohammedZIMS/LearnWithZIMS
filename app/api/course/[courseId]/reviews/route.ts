import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";
import { getUserReview } from "@/app/data/user/get-user-review";

// GET all reviews
export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const data = await getUserReview(courseId);
  return NextResponse.json(data);
}

// POST a review
export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  const user = await requireUser(); // must be logged in
  const { courseId } = params;
  const { rating, comment } = await req.json();

  try {
    await prisma.rating.upsert({
      where: {
        userId_courseId: { userId: user.id, courseId },
      },
      update: { rating, comment },
      create: { userId: user.id, courseId, rating, comment },
    });

    const updatedData = await getUserReview(courseId);
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Error saving review:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}
