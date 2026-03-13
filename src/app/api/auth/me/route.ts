import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { User } from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const { name, firstName, lastName, middleName, gender, phone, occupation, location } = body;

    const user = await User.findByIdAndUpdate(
      payload.userId,
      {
        ...(name && { name }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(middleName && { middleName }),
        ...(gender && { gender }),
        ...(phone && { phone }),
        ...(occupation && { occupation }),
        ...(location && { location }),
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        gender: user.gender,
        phone: user.phone,
        occupation: user.occupation,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Auth update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
