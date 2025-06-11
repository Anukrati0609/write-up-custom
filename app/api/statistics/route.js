import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  limit,
} from "firebase/firestore";

// Function to ensure collections exist
async function ensureCollectionsExist() {
  try {
    const collections = ["entries", "votes", "users"];
    for (const collectionName of collections) {
      const testQuery = query(collection(db, collectionName), limit(1));
      const testDoc = await getDocs(testQuery);
      if (testDoc.empty) {
        const tempDocRef = doc(db, collectionName, "temp");
        await setDoc(tempDocRef, { temp: true });
        await setDoc(tempDocRef, {}, { merge: false }); // Delete content
      }
    }
  } catch (error) {
    console.log("Collections setup:", error.message);
  }
}

export async function GET(request) {
  try {
    await ensureCollectionsExist(); // Get all entries with their vote counts
    const entriesSnapshot = await getDocs(collection(db, "entries"));
    const entries = [];

    entriesSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data.temp) {
        entries.push({
          id: data.id,
          title: data.title,
          authorName: data.authorName,
          year: data.year,
          branch: data.branch,
          votes: data.votes || 0,
          voters: data.voters || [],
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        });
      }
    });

    // Sort by votes (descending)
    entries.sort((a, b) => b.votes - a.votes);

    // Get total vote statistics
    const votesSnapshot = await getDocs(collection(db, "votes"));
    const totalVotes = votesSnapshot.size; // Get total users
    const usersSnapshot = await getDocs(collection(db, "users"));
    const totalUsers = usersSnapshot.size;

    let votedUsers = 0;
    usersSnapshot.forEach((docSnap) => {
      const userData = docSnap.data();
      if (userData.is_voted && !userData.temp) {
        votedUsers++;
      }
    });

    return NextResponse.json({
      success: true,
      statistics: {
        totalEntries: entries.length,
        totalVotes,
        totalUsers,
        votedUsers,
        votingPercentage:
          totalUsers > 0 ? ((votedUsers / totalUsers) * 100).toFixed(2) : 0,
      },
      leaderboard: entries.slice(0, 10), // Top 10 entries
      allEntries: entries,
    });
  } catch (error) {
    console.error("Statistics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
