import { NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export async function POST(request) {
  try {
    const { userId, entryId } = await request.json();

    if (!userId || !entryId) {
      return NextResponse.json(
        { error: "User ID and Entry ID are required" },
        { status: 400 }
      );
    }

    // Check if user exists and has voted
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    if (!userData.is_voted || userData.votedFor !== entryId) {
      return NextResponse.json(
        { error: "You haven't voted for this entry" },
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

    // Check if user has voted for this entry
    if (!entryData.voters || !entryData.voters.includes(userId)) {
      return NextResponse.json(
        { error: "You haven't voted for this entry" },
        { status: 400 }
      );
    }

    // Update entry by removing vote
    const updatedVoters = entryData.voters.filter((voter) => voter !== userId);
    await updateDoc(entryDocRef, {
      votes: Math.max((entryData.votes || 0) - 1, 0), // Ensure votes don't go below 0
      voters: updatedVoters,
      updatedAt: new Date(),
    });

    // Update user's voting status
    await updateDoc(userDocRef, {
      is_voted: false,
      votedFor: null,
      updatedAt: new Date(),
    });

    // Delete the vote tracking record
    const voteId = `vote_${userId}_${entryId}`;
    const voteDocRef = doc(db, "votes", voteId);

    // Check if vote record exists before attempting to delete
    const voteDoc = await getDoc(voteDocRef);
    if (voteDoc.exists()) {
      await deleteDoc(voteDocRef);
    }

    return NextResponse.json({
      success: true,
      message: "Vote removed successfully",
    });
  } catch (error) {
    console.error("Unlike error:", error);
    return NextResponse.json(
      { error: "Failed to remove vote" },
      { status: 500 }
    );
  }
}
