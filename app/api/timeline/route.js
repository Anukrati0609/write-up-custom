import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  limit,
} from "firebase/firestore";

// Timeline default structure
const DEFAULT_TIMELINE = {
  registrationStart: new Date().toISOString(),
  registrationEnd: new Date(
    Date.now() + 14 * 24 * 60 * 60 * 1000
  ).toISOString(), // 2 weeks from now
  submissionStart: new Date().toISOString(),
  submissionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  votingStart: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(), // 31 days from now
  votingEnd: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
  resultsDate: new Date(Date.now() + 46 * 24 * 60 * 60 * 1000).toISOString(), // 46 days from now
  updatedAt: new Date().toISOString(),
};

async function getTimeline() {
  try {
    // Check if timeline document exists
    const timelineRef = doc(db, "settings", "timeline");
    const timelineDoc = await getDoc(timelineRef);

    if (!timelineDoc.exists()) {
      // Create default timeline if it doesn't exist
      await setDoc(timelineRef, DEFAULT_TIMELINE);
      return DEFAULT_TIMELINE;
    }

    return timelineDoc.data();
  } catch (error) {
    console.error("Error getting timeline:", error);
    throw error;
  }
}

async function updateTimeline(timeline) {
  try {
    const timelineRef = doc(db, "settings", "timeline");
    await setDoc(timelineRef, {
      ...timeline,
      updatedAt: new Date().toISOString(),
    });
    return await getTimeline();
  } catch (error) {
    console.error("Error updating timeline:", error);
    throw error;
  }
}

export async function GET(request) {
  try {
    const timeline = await getTimeline();
    return NextResponse.json({ timeline });
  } catch (error) {
    console.error("Timeline error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch timeline",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { timeline } = await request.json();

    if (!timeline) {
      return NextResponse.json(
        { error: "Timeline data is required" },
        { status: 400 }
      );
    }

    const updated = await updateTimeline(timeline);

    return NextResponse.json({
      success: true,
      timeline: updated,
    });
  } catch (error) {
    console.error("Update timeline error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update timeline",
      },
      { status: 500 }
    );
  }
}
