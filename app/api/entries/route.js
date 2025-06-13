import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  limit,
  where,
} from "firebase/firestore";

// Function to ensure collections exist
async function ensureCollectionsExist() {
  try {
    // Check if entries collection exists
    const entriesQuery = query(collection(db, "entries"), limit(1));
    const entriesTest = await getDocs(entriesQuery);
    if (entriesTest.empty) {
      const tempDocRef = doc(db, "entries", "temp");
      await setDoc(tempDocRef, { temp: true });
      await setDoc(tempDocRef, {}, { merge: false }); // Delete content
      console.log("Entries collection created");
    }

    // Check if users collection exists
    const usersQuery = query(collection(db, "users"), limit(1));
    const usersTest = await getDocs(usersQuery);
    if (usersTest.empty) {
      const tempDocRef = doc(db, "users", "temp");
      await setDoc(tempDocRef, { temp: true });
      await setDoc(tempDocRef, {}, { merge: false }); // Delete content
      console.log("Users collection created");
    }
  } catch (error) {
    console.log("Collections already exist or creation failed:", error.message);
  }
}

export async function POST(request) {
  try {
    const { userId, fullName, year, branch, title, content } =
      await request.json();

    if (!userId || !fullName || !year || !branch || !title || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Ensure collections exist
    await ensureCollectionsExist(); // Check if user already submitted an entry
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    if (userData.is_submitted) {
      return NextResponse.json(
        { error: "You have already submitted an entry" },
        { status: 400 }
      );
    }

    // Create entry document
    const entryId = `entry_${userId}`;
    const entryDocRef = doc(db, "entries", entryId);
    const entryData = {
      id: entryId,
      userId,
      authorName: fullName,
      year,
      branch,
      title,
      content,
      votes: 0,
      voters: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(entryDocRef, entryData);

    // Update user's submission status
    await updateDoc(userDocRef, {
      is_submitted: true,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Entry submitted successfully",
      entryId,
    });
  } catch (error) {
    console.error("Entry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit entry" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Ensure collections exist
    await ensureCollectionsExist();

    let entriesQuery;

    if (userId) {
      // Get approved entries excluding the current user's entry
      entriesQuery = query(
        collection(db, "entries"),
        where("status", "==", "approved"),
        where("userId", "!=", userId)
      );
    } else {
      // Get only approved entries
      entriesQuery = query(
        collection(db, "entries"),
        where("status", "==", "approved")
      );
    }

    const querySnapshot = await getDocs(entriesQuery);
    // console.log('snao',querySnapshot) // Optional: for debugging
    const entries = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      // Skip temporary documents if any (related to ensureCollectionsExist logic)
      if (data.temp) return;

      entries.push({
        id: data.id || docSnap.id, // Use data.id if present, otherwise docSnap.id
        authorName: data.authorName, // Assuming authorName is stored
        year: data.year,
        branch: data.branch,
        title: data.title,
        content: data.content,
        votes: data.votes || 0,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      });
    });

    // Sort by votes (descending) then by creation date (descending, newest first)
    entries.sort((a, b) => {
      if (b.votes !== a.votes) {
        return b.votes - a.votes;
      }
      // Ensure createdAt is valid Date object for comparison
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      entries,
    });
  } catch (error) {
    console.error("Fetch entries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}
