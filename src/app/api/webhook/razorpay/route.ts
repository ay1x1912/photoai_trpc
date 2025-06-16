import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/db";
import { order, user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Status } from "@/modules/image/type";
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    console.log(body);

    const signautre = req.headers.get("x-razorpay-signature");
    const expcetedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRECT!)
      .update(body)
      .digest("hex");
    if (signautre !== expcetedSignature) {
      console.log("signature not matched");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    const event = JSON.parse(body);
    console.log(`webhook:${event}`);
    if (event.event === "payment.captured") {
      const payment = await event.payload.payment.entity;
      console.log(payment);
      const [successOrder] = await db
        .update(order)
        .set({ status: Status.Success, razropayPaymentId: payment.id })
        .returning();

      await db
        .update(user)
        .set({ token: sql`${user.token} + 10` })
        .where(eq(user.id, successOrder.userId));
    }

    return NextResponse.json({ msg: "Success" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 5 });
  }
}
