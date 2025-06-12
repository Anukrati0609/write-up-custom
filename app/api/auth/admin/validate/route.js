import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find admin with matching session token
    const adminRef = collection(db, "admins");
    const adminQuery = query(
      adminRef,
      where("sessionToken", "==", sessionToken)
    );
    const snapshot = await getDocs(adminQuery);

    if (snapshot.empty) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const adminDoc = snapshot.docs[0];
    const admin = adminDoc.data();

    // Check if session has expired
    if (admin.sessionExpires < Date.now()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // Return admin data (excluding sensitive info)
    return NextResponse.json({
      success: true,
      admin: {
        id: adminDoc.id,
        email: admin.email,
        name: admin.name || admin.email.split("@")[0],
        role: admin.role || "admin",
      },
    });
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
