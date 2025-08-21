import { requireAdmin } from "@/app/data/admin/require-asmin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { env } from "@/lib/env";
import { S3 } from "@/lib/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const aj = arcjet.withRule(
    
    fixedWindow({
        mode: "LIVE",
        window: "1m",
        max: 5,
    })
);

export async function DELETE(request: Request) {

    const session = await requireAdmin();

    try {

        const decision = await aj.protect(request, { footprint: session?.user.id as string });

        if (decision.isDenied()) {
            return NextResponse.json({ error: "Hey bro this is not good" }, { status: 429 })
        }

        const body = await request.json();

        const key = body.key;

        if (!key || typeof key !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid object key" },
                { status: 400 }
            );
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: key,
        });

        await S3.send(command);

        return NextResponse.json(
            { message: "File deleted successfully!" },
            { status: 200 }
        );

    } catch (err) {
        console.error("S3 Delete Error:", err);

        return NextResponse.json(
            { error: "Failed to delete file from S3" },
            { status: 500 }
        );
    }
}
