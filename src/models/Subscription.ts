import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  user_id: mongoose.Types.ObjectId;
  service_name: string;
  price: number;
  billing_cycle: "monthly" | "yearly";
  renewal_date: Date;
  category: string;
  notes?: string;
  created_at: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  service_name: { type: String, required: true },
  price: { type: Number, required: true },
  billing_cycle: { type: String, enum: ["monthly", "yearly"], required: true },
  renewal_date: { type: Date, required: true },
  category: {
    type: String,
    enum: ["Entertainment", "Fitness", "Productivity", "Education", "Shopping", "Other"],
    required: true,
  },
  notes: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
});

export const Subscription =
  mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
