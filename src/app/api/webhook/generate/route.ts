import db from "@/db";
import { outputImage } from "@/db/schema";
import { Status } from "@/modules/image/type";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { request_id, status } = body;
  console.log("route hit");
  if (status == "OK") {
    await db
      .update(outputImage)
      .set({ imageUrl: body.payload.images[0].url, status: Status.Success })
      .where(eq(outputImage.falAiRequest_id, request_id));
    return NextResponse.json({ msg: "Generated successfuly" });
  }
  if (status == "ERROR") {
    console.log("failed");
    console.log(body);
    await db
      .update(outputImage)
      .set({ status: Status.Failed })
      .where(eq(outputImage.falAiRequest_id, request_id));
    return NextResponse.json({ error: body.paylodad }, { status: 400 });
  }
}
