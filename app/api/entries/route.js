import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, limit, where } from "firebase/firestore";

// Function to ensure collections exist
async function ensureCollectionsExist() {
  try {
    // Check if entries collection exists
    const entriesTest = await adminDb.collection("entries").limit(1).get();
    if (entriesTest.empty) {
      const tempDocRef = adminDb.collection("entries").doc("temp");
      await tempDocRef.set({ temp: true });
      await tempDocRef.delete();
      console.log("Entries collection created");
    }

    // Check if users collection exists
    const usersTest = await adminDb.collection("users").limit(1).get();
    if (usersTest.empty) {
      const tempDocRef = adminDb.collection("users").doc("temp");
      await tempDocRef.set({ temp: true });
      await tempDocRef.delete();
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
    await ensureCollectionsExist();

    // Check if user already submitted an entry
    const userDocRef = adminDb.collection("users").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    if (userData.is_submitted) {
      return NextResponse.json(
        { error: "You have already submitted an entry" },
        { status: 400 }
      );
    }

    // Validate content length (1000-1500 words approximately)
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    if (wordCount < 1000 || wordCount > 1500) {
      return NextResponse.json(
        { error: "Content must be between 1000-1500 words" },
        { status: 400 }
      );
    }

    // Create entry document
    const entryId = `entry_${userId}`;
    const entryDocRef = adminDb.collection("entries").doc(entryId);
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

    await entryDocRef.set(entryData);

    // Update user's submission status
    await userDocRef.update({
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

    // Get all entries (excluding the current user's entry if userId is provided)
    let entriesQuery = adminDb.collection("entries");

    if (userId) {
      entriesQuery = entriesQuery.where("userId", "!=", userId);
    }

    const querySnapshot = await entriesQuery.get();
    const entries = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Skip temporary documents
      if (data.temp) return;

      entries.push({
        id: data.id,
        userId: data.userId,
        authorName: data.authorName,
        year: data.year,
        branch: data.branch,
        title: data.title,
        content: data.content,
        votes: data.votes || 0,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      });
    });

    // Sort by votes (descending) then by creation date
    entries.sort((a, b) => {
      if (b.votes !== a.votes) {
        return b.votes - a.votes;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
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
