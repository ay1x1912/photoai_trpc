import db from "@/db";
import { order } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID as string;
const key_secret = process.env.RAZORPAY_KEY_SECRET as string;

if (!key_id || !key_secret) {
  throw new Error("Razorpay keys are missing");
}

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export type OrderBody = {
  amount: number;
  currency: string;
};

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "UNATHUORIZED" }, { status: 400 });
    }
    const options = {
      amount: 200 * 100,
      currency: "INR",
      receipt: `receipt#${Date.now()}`,
    };

    const orders = await razorpay.orders.create(options);
    await db.insert(order).values({
      userId: session.user.id,
      razropayOrderId: orders.id,
      price: 200 * 100,
      ammount: 200 * 100,
     
    });
    console.log("Order Created Successfully");

    return NextResponse.json({ orderId: orders.id }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error },
      { status: 500 }
    );
  }
}
