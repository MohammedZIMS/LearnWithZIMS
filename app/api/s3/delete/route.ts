// /app/api/s3/delete/route.ts

import { env } from "@/lib/env";
import { S3 } from "@/lib/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    try {
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
