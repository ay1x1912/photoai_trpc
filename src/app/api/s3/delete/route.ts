import { S3 } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { key } = body;
    if (!key) {
      return NextResponse.json({ error: "Missing Key" }, { status: 400 });
    }
      const command = new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
      })
      await S3.send(command);
      return NextResponse.json({msg:"File deleted succesfully"},{status:200})
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
