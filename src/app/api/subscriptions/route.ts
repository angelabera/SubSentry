import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Subscription } from "@/models/Subscription";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const subscriptions = await Subscription.find({ user_id: payload.userId }).sort({ renewal_date: 1 });
    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { service_name, price, billing_cycle, renewal_date, category, notes } = body;

    if (!service_name || !price || !billing_cycle || !renewal_date || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subscription = await Subscription.create({
      user_id: payload.userId,
      service_name,
      price: Number(price),
      billing_cycle,
      renewal_date: new Date(renewal_date),
      category,
      notes: notes || "",
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    console.error("Create subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
