import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, setDoc, query, limit } from "firebase/firestore";

// Function to ensure users collection exists
async function ensureUserCollectionExists() {
  try {
    const testQuery = query(collection(db, "users"), limit(1));
    const testDoc = await getDocs(testQuery);
    if (testDoc.empty) {
      const tempDocRef = doc(db, "users", "temp");
      await setDoc(tempDocRef, { temp: true });
      await setDoc(tempDocRef, {}, { merge: false }); // Delete content
      console.log("Users collection created");
    }
  } catch (error) {
    console.log("Collection already exists or creation failed:", error.message);
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Ensure collections exist
    await ensureUserCollectionExists();    // Get user document
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    return NextResponse.json({
      success: true,
      user: {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        is_submitted: userData.is_submitted || false,
        is_voted: userData.is_voted || false,
        votedFor: userData.votedFor || null,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Failed to get user data" },
      { status: 500 }
    );
  }
}
