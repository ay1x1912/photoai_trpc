import db from "@/db";;
import { model } from "@/db/schema";
import { Status } from "@/modules/image/type";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { status, request_id, tensorPath } = body;
  console.log(body);
  if (status == "OK") {
    await db
      .update(model)
      .set({ status: Status.Success, tensorPath: tensorPath })
      .where(eq(model.falAiRequest_id, request_id));

    return NextResponse.json({ msg: "Trained successfuly" });
  }
    if (status == "ERROR") {
      await db.update(model).set({status:Status.Failed}).where(eq(model.falAiRequest_id,request_id))
   
    return NextResponse.json({ error: body.paylodad.detail.msg });
  }
}
