import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  user_id: mongoose.Types.ObjectId;
  message: string;
  created_at: Date;
  read_status: boolean;
}

const NotificationSchema = new Schema<INotification>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  read_status: { type: Boolean, default: false },
});

export const Notification =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
