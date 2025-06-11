import { NextResponse } from "next/server";
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  limit,
  getDocs,
} from "firebase/firestore";

// Function to ensure users collection exists
async function ensureCollectionExists() {
  try {
    // Check if users collection exists by trying to get a document
    const testQuery = query(collection(db, "users"), limit(1));
    const testDoc = await getDocs(testQuery);

    // If collection doesn't exist, create it with a dummy document and then delete it
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

export async function POST(request) {
  try {
    const { userDoc } = await request.json();
    console.log("Received userDoc:", userDoc);

    if (!userDoc || !userDoc.uid) {
      return NextResponse.json(
        { error: "User information is required" },
        { status: 400 }
      );
    }

    // Ensure collections exist
    await ensureCollectionExists(); // Extract user information
    const { uid, email, displayName, photoURL } = userDoc;

    // Check if user exists in Firestore
    const userDocRef = doc(db, "users", uid);
    const userDocSnapshot = await getDoc(userDocRef);
    console.log(
      "User document:",
      userDocSnapshot,
      userDocSnapshot.exists() ? "exists" : "does not exist"
    );

    let userData;
    if (!userDocSnapshot.exists()) {
      // Create new user document
      userData = {
        uid,
        email,
        displayName,
        photoURL,
        is_submitted: false,
        is_voted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(userDocRef, userData);
    } else {
      // Update existing user's last login
      userData = userDocSnapshot.data();
      await updateDoc(userDocRef, {
        updatedAt: new Date(),
        displayName,
        photoURL,
      });
    }
    return NextResponse.json({
      success: true,
      user: {
        uid,
        email,
        displayName,
        photoURL,
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
