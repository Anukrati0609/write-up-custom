import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  try {
    // For server-side logout, we just return success
    // The client will handle clearing the auth state
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
