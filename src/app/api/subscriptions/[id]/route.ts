import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Subscription } from "@/models/Subscription";
import { getUserFromRequest } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const subscription = await Subscription.findOneAndUpdate(
      { _id: id, user_id: payload.userId },
      {
        service_name: body.service_name,
        price: Number(body.price),
        billing_cycle: body.billing_cycle,
        renewal_date: new Date(body.renewal_date),
        category: body.category,
        notes: body.notes || "",
      },
      { new: true }
    );

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Update subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const subscription = await Subscription.findOneAndDelete({
      _id: id,
      user_id: payload.userId,
    });

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Subscription deleted" });
  } catch (error) {
    console.error("Delete subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
