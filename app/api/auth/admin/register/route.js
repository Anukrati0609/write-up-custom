import { NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { 
  collection, 
  doc, 
  getDoc,
  setDoc,
  query,
  where,
  getDocs 
} from "firebase/firestore";
import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "adminSecretKey123";

// Registration endpoint
export async function POST(request) {
  try {
    const { email, password, secretKey } = await request.json();
    
    if (!email || !password || !secretKey) {
      return NextResponse.json(
        { error: "Email, password, and secret key are required" },
        { status: 400 }
      );
    }

    // Validate the secret key to prevent unauthorized registrations
    if (secretKey !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 403 }
      );
    }

    // Check if admin with email already exists
    const adminRef = collection(db, "admins");
    const adminQuery = query(adminRef, where("email", "==", email));
    const snapshot = await getDocs(adminQuery);

    if (!snapshot.empty) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password for storage
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Generate a session token
    const sessionToken = crypto.randomUUID();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create new admin document
    const adminId = crypto.randomUUID();
    await setDoc(doc(db, "admins", adminId), {
      email,
      passwordHash: hashedPassword,
      role: "admin",
      createdAt: Date.now(),
      lastLogin: Date.now(),
      sessionToken,
      sessionExpires: expiresAt,
    });

    // Set secure cookie with session token
    const cookieStore = cookies();
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
        id: adminId,
        email,
        name: email.split('@')[0],
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
