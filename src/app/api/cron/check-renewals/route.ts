import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { Subscription } from "@/models/Subscription";
import { Notification } from "@/models/Notification";

export async function POST() {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const subscriptions = await Subscription.find({
      renewal_date: { $gte: today, $lte: threeDaysFromNow },
    });

    const notifications = [];
    for (const sub of subscriptions) {
      const daysLeft = Math.ceil(
        (new Date(sub.renewal_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      const dayText = daysLeft === 0 ? "today" : daysLeft === 1 ? "tomorrow" : `in ${daysLeft} days`;
      const message = `⚠ ${sub.service_name} renews ${dayText} — ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(sub.price)}`;

      const existing = await Notification.findOne({
        user_id: sub.user_id,
        message,
        created_at: { $gte: today },
      });

      if (!existing) {
        notifications.push({
          user_id: sub.user_id,
          message,
          read_status: false,
        });
      }
    }

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return NextResponse.json({
      message: `Checked ${subscriptions.length} subscriptions, created ${notifications.length} alerts`,
    });
  } catch (error) {
    console.error("Cron check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
