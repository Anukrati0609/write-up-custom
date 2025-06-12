import { NextResponse } from "next/server";
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "adminSecretKey123";

// Login endpoint
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Hash the password to check against stored hash
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Check if admin exists with matching credentials
    const adminRef = collection(db, "admins");
    const adminQuery = query(adminRef, where("email", "==", email));
    const snapshot = await getDocs(adminQuery);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const adminDoc = snapshot.docs[0];
    const admin = adminDoc.data();

    // Check password
    if (admin.passwordHash !== hashedPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate a session token
    const sessionToken = crypto.randomUUID();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Store session token in admin document
    await setDoc(
      doc(db, "admins", adminDoc.id),
      {
        sessionToken,
        sessionExpires: expiresAt,
        lastLogin: Date.now(),
      },
      { merge: true }
    );

    // Set secure cookie with session token
    const cookieStore = await cookies();
    cookieStore.set({
      name: "admin_token",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      path: "/",
    });

    // Return admin data (excluding sensitive info)
    return NextResponse.json({
      success: true,
      admin: {
        id: adminDoc.id,
        email: admin.email,
        name: admin.name || email.split("@")[0],
        role: admin.role || "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
