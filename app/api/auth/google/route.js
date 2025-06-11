import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/config/firebase-admin";

// Function to ensure users collection exists
async function ensureCollectionExists() {
  try {
    // Check if users collection exists by trying to get a document
    const testDoc = await adminDb.collection("users").limit(1).get();

    // If collection doesn't exist, create it with a dummy document and then delete it
    if (testDoc.empty) {
      const tempDocRef = adminDb.collection("users").doc("temp");
      await tempDocRef.set({ temp: true });
      await tempDocRef.delete();
      console.log("Users collection created");
    }
  } catch (error) {
    console.log("Collection already exists or creation failed:", error.message);
  }
}

export async function POST(request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Ensure collections exist
    await ensureCollectionExists();

    // Verify the ID token using Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists in Firestore
    const userDocRef = adminDb.collection("users").doc(uid);
    const userDoc = await userDocRef.get();
    console.log(
      "User document:",
      userDoc,
      userDoc.exists ? "exists" : "does not exist"
    );

    let userData;

    if (!userDoc.exists) {
      // Create new user document
      userData = {
        uid,
        email,
        displayName: name,
        photoURL: picture,
        is_submitted: false,
        is_voted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await userDocRef.set(userData);
    } else {
      // Update existing user's last login
      userData = userDoc.data();
      await userDocRef.update({
        updatedAt: new Date(),
        displayName: name,
        photoURL: picture,
      });
    }
    return NextResponse.json({
      success: true,
      user: {
        uid,
        email,
        displayName: name,
        photoURL: picture,
        is_submitted: userData.is_submitted,
        is_voted: userData.is_voted,
      },
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
