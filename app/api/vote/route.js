import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, updateDoc, setDoc, query, limit } from "firebase/firestore";

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

    // Check if votes collection exists for tracking
    const votesQuery = query(collection(db, "votes"), limit(1));
    const votesTest = await getDocs(votesQuery);
    if (votesTest.empty) {
      const tempDocRef = doc(db, "votes", "temp");
      await setDoc(tempDocRef, { temp: true });
      await setDoc(tempDocRef, {}, { merge: false }); // Delete content
      console.log("Votes collection created");
    }
  } catch (error) {
    console.log("Collections already exist or creation failed:", error.message);
  }
}

export async function POST(request) {
  try {
    const { userId, entryId } = await request.json();

    if (!userId || !entryId) {
      return NextResponse.json(
        { error: "User ID and Entry ID are required" },
        { status: 400 }
      );
    }

    // Ensure collections exist
    await ensureCollectionsExist();    // Check if user exists and hasn't voted yet
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    if (userData.is_voted) {
      return NextResponse.json(
        { error: "You have already voted" },
        { status: 400 }
      );
    }

    // Check if entry exists
    const entryDocRef = doc(db, "entries", entryId);
    const entryDoc = await getDoc(entryDocRef);

    if (!entryDoc.exists()) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const entryData = entryDoc.data();

    // Check if user is trying to vote for their own entry
    if (entryData.userId === userId) {
      return NextResponse.json(
        { error: "You cannot vote for your own entry" },
        { status: 400 }
      );
    }

    // Check if user has already voted for this entry
    if (entryData.voters && entryData.voters.includes(userId)) {
      return NextResponse.json(
        { error: "You have already voted for this entry" },
        { status: 400 }
      );    } // Update entry with vote
    const currentVoters = entryData.voters || [];
    await updateDoc(entryDocRef, {
      votes: (entryData.votes || 0) + 1,
      voters: [...currentVoters, userId],
      updatedAt: new Date(),
    });

    // Update user's voting status
    await updateDoc(userDocRef, {
      is_voted: true,
      votedFor: entryId,
      updatedAt: new Date(),
    });

    // Create a vote tracking record
    const voteId = `vote_${userId}_${entryId}`;
    const voteDocRef = doc(db, "votes", voteId);
    await setDoc(voteDocRef, {
      id: voteId,
      voterId: userId,
      entryId: entryId,
      entryAuthor: entryData.userId,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Vote cast successfully",
    });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 });
  }
}
