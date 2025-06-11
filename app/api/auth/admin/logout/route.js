import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get("admin_token")?.value;

    if (adminToken) {
      // Clear the cookie
      cookieStore.set({
        name: "admin_token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
