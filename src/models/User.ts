import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  phone?: string;
  occupation?: string;
  location?: string;
  created_at: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  gender: { type: String },
  phone: { type: String },
  occupation: { type: String },
  location: { type: String },
  created_at: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
