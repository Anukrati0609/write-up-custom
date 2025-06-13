import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  writeBatch,
  query,
  limit,
  where,
  updateDoc,
} from "firebase/firestore";
import { cookies } from "next/headers";

// Function to initialize all required collections
async function initializeCollections() {
  const collections = ["users", "entries", "votes", "settings", "admins"];
  const results = [];

  for (const collectionName of collections) {
    try {
      const testQuery = query(collection(db, collectionName), limit(1));
      const testDoc = await getDocs(testQuery);
      if (testDoc.empty) {
        const tempDocRef = doc(db, collectionName, "temp");
        await setDoc(tempDocRef, { temp: true, createdAt: new Date() });
        await setDoc(tempDocRef, {}, { merge: false }); // Delete content
        results.push({ collection: collectionName, status: "created" });
      } else {
        results.push({ collection: collectionName, status: "exists" });
      }
    } catch (error) {
      results.push({
        collection: collectionName,
        status: "error",
        error: error.message,
      });
    }
  }

  return results;
}

// Function to validate admin session
async function validateAdminSession(request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_token")?.value;

  if (!sessionToken) {
    return null;
  }

  // Find admin with matching session token
  const adminRef = collection(db, "admins");
  const adminQuery = query(adminRef, where("sessionToken", "==", sessionToken));
  const snapshot = await getDocs(adminQuery);

  if (snapshot.empty) {
    return null;
  }

  const adminDoc = snapshot.docs[0];
  const admin = adminDoc.data();

  // Check if session has expired
  if (admin.sessionExpires < Date.now()) {
    return null;
  }

  return {
    id: adminDoc.id,
    email: admin.email,
    name: admin.name || admin.email.split("@")[0],
    role: admin.role || "admin",
  };
}

// GET - Get admin data and statistics
export async function GET(request) {
  try {
    // Validate admin session
    const admin = await validateAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "stats";

    // Handle different actions
    switch (action) {
      case "stats":
        // Get collection statistics
        const stats = {};
        const collections = ["users", "entries", "votes"];
        for (const collectionName of collections) {
          try {
            const snapshot = await getDocs(collection(db, collectionName));
            stats[collectionName] = {
              count: snapshot.size,
              documents: snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
                createdAt:
                  docSnap.data().createdAt?.toDate?.()?.toISOString() ||
                  docSnap.data().createdAt ||
                  null,
                updatedAt:
                  docSnap.data().updatedAt?.toDate?.()?.toISOString() ||
                  docSnap.data().updatedAt ||
                  null,
              })),
            };
          } catch (error) {
            stats[collectionName] = { error: error.message, count: 0 };
          }
        }

        return NextResponse.json({
          success: true,
          stats,
        });

      case "entries":
        // Get all entries with detailed information
        const entriesSnapshot = await getDocs(collection(db, "entries"));
        const entries = entriesSnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          createdAt:
            docSnap.data().createdAt?.toDate?.()?.toISOString() ||
            docSnap.data().createdAt ||
            null,
          updatedAt:
            docSnap.data().updatedAt?.toDate?.()?.toISOString() ||
            docSnap.data().updatedAt ||
            null,
        }));

        return NextResponse.json({
          success: true,
          entries,
        });

      case "users":
        // Get all users with detailed information
        const usersSnapshot = await getDocs(collection(db, "users"));
        const users = usersSnapshot.docs.map((docSnap) => ({
          uid: docSnap.id,
          ...docSnap.data(),
          createdAt:
            docSnap.data().createdAt?.toDate?.()?.toISOString() ||
            docSnap.data().createdAt ||
            null,
          updatedAt:
            docSnap.data().updatedAt?.toDate?.()?.toISOString() ||
            docSnap.data().updatedAt ||
            null,
        }));

        return NextResponse.json({
          success: true,
          users,
        });

      case "settings":
        // Get application settings
        const settingsSnapshot = await getDocs(collection(db, "settings"));
        let settings = null;

        if (!settingsSnapshot.empty) {
          // Get the first settings document
          const settingsDoc = settingsSnapshot.docs[0];
          settings = {
            id: settingsDoc.id,
            ...settingsDoc.data(),
            createdAt:
              settingsDoc.data().createdAt?.toDate?.()?.toISOString() ||
              settingsDoc.data().createdAt ||
              null,
            updatedAt:
              settingsDoc.data().updatedAt?.toDate?.()?.toISOString() ||
              settingsDoc.data().updatedAt ||
              null,
          };
        } else {
          // Create default settings if none exist
          const defaultSettings = {
            votingEnabled: true,
            submissionEnabled: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const settingsRef = doc(collection(db, "settings"));
          await setDoc(settingsRef, defaultSettings);

          settings = {
            id: settingsRef.id,
            ...defaultSettings,
            createdAt: defaultSettings.createdAt.toISOString(),
            updatedAt: defaultSettings.updatedAt.toISOString(),
          };
        }

        return NextResponse.json({
          success: true,
          settings,
        });

      case "entry":
        // Get single entry by ID
        const entryId = searchParams.get("id");

        if (!entryId) {
          return NextResponse.json(
            { error: "Entry ID is required" },
            { status: 400 }
          );
        }

        const entryDocRef = doc(db, "entries", entryId);
        const entryDocSnap = await getDoc(entryDocRef);

        if (!entryDocSnap.exists()) {
          return NextResponse.json(
            { error: "Entry not found" },
            { status: 404 }
          );
        }

        const entry = {
          id: entryDocSnap.id,
          ...entryDocSnap.data(),
          createdAt:
            entryDocSnap.data().createdAt?.toDate?.()?.toISOString() ||
            entryDocSnap.data().createdAt ||
            null,
          updatedAt:
            entryDocSnap.data().updatedAt?.toDate?.()?.toISOString() ||
            entryDocSnap.data().updatedAt ||
            null,
        };

        return NextResponse.json({
          success: true,
          entry,
        });

      case "timeline":
        try {
          const timelineRef = doc(db, "settings", "timeline");
          const timelineDoc = await getDoc(timelineRef);

          let timeline = null;

          if (!timelineDoc.exists()) {
            // Create default timeline
            const defaultTimeline = {
              registrationStart: new Date().toISOString(),
              registrationEnd: new Date(
                Date.now() + 14 * 24 * 60 * 60 * 1000
              ).toISOString(), // 2 weeks from now
              submissionStart: new Date().toISOString(),
              submissionEnd: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString(), // 30 days from now
              votingStart: new Date(
                Date.now() + 31 * 24 * 60 * 60 * 1000
              ).toISOString(), // 31 days from now
              votingEnd: new Date(
                Date.now() + 45 * 24 * 60 * 60 * 1000
              ).toISOString(), // 45 days from now
              resultsDate: new Date(
                Date.now() + 46 * 24 * 60 * 60 * 1000
              ).toISOString(), // 46 days from now
              updatedAt: new Date().toISOString(),
            };

            await setDoc(timelineRef, defaultTimeline);
            timeline = defaultTimeline;
          } else {
            timeline = timelineDoc.data();
          }

          return NextResponse.json({ timeline });
        } catch (error) {
          console.error("Error fetching timeline:", error);
          return NextResponse.json(
            { error: "Failed to fetch timeline" },
            { status: 500 }
          );
        }

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action parameter",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin GET error:", error);
    return NextResponse.json(
      { error: "Failed to process admin request" },
      { status: 500 }
    );
  }
}

// POST - Handle admin actions
export async function POST(request) {
  try {
    // Validate admin session
    const admin = await validateAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await request.json();
    const { action } = requestBody;

    switch (action) {
      case "initialize":
        const results = await initializeCollections();
        return NextResponse.json({
          success: true,
          message: "Collections initialization completed",
          results,
        });

      case "updateTimeline":
        // Update the timeline settings
        const { timeline } = requestBody;

        if (!timeline) {
          return NextResponse.json(
            { error: "Timeline data is required" },
            { status: 400 }
          );
        }

        try {
          const timelineRef = doc(db, "settings", "timeline");
          await setDoc(timelineRef, {
            ...timeline,
            updatedAt: new Date().toISOString(),
          });

          // Fetch the updated timeline
          const updatedTimelineDoc = await getDoc(timelineRef);
          const updatedTimeline = updatedTimelineDoc.data();

          return NextResponse.json({
            success: true,
            timeline: updatedTimeline,
          });
        } catch (error) {
          console.error("Failed to update timeline:", error);
          return NextResponse.json(
            { error: "Failed to update timeline" },
            { status: 500 }
          );
        }

      case "updateEntryStatus":
        // Update an entry's status (approve/reject)
        const { entryId, status } = requestBody;

        if (!entryId || !status) {
          return NextResponse.json(
            { error: "Entry ID and status are required" },
            { status: 400 }
          );
        }

        // Valid status values
        if (!["pending", "approved", "rejected"].includes(status)) {
          return NextResponse.json(
            { error: "Invalid status value" },
            { status: 400 }
          );
        }

        const entryRef = doc(db, "entries", entryId);
        const entrySnap = await getDoc(entryRef);

        if (!entrySnap.exists()) {
          return NextResponse.json(
            { error: "Entry not found" },
            { status: 404 }
          );
        }

        // Update the entry status
        await updateDoc(entryRef, {
          status,
          updatedAt: new Date(),
          reviewedBy: admin.id,
          reviewedAt: new Date(),
        });

        return NextResponse.json({
          success: true,
          message: `Entry status updated to '${status}'`,
        });

      case "updateSettings":
        // Update application settings
        const { settings } = requestBody;

        if (!settings) {
          return NextResponse.json(
            { error: "Settings object is required" },
            { status: 400 }
          );
        }

        // Get the settings collection
        const settingsSnapshot = await getDocs(collection(db, "settings"));
        let settingsRef;

        if (settingsSnapshot.empty) {
          // Create new settings document if none exists
          settingsRef = doc(collection(db, "settings"));
        } else {
          // Use the first settings document
          settingsRef = doc(db, "settings", settingsSnapshot.docs[0].id);
        }

        // Update or create settings
        const updatedSettings = {
          ...settings,
          updatedAt: new Date(),
          updatedBy: admin.id,
        };

        await setDoc(settingsRef, updatedSettings, { merge: true });

        return NextResponse.json({
          success: true,
          settings: {
            id: settingsRef.id,
            ...updatedSettings,
            updatedAt: updatedSettings.updatedAt.toISOString(),
          },
        });

      case "deleteEntry":
        // Delete an entry
        const { entryIdToDelete } = requestBody;

        if (!entryIdToDelete) {
          return NextResponse.json(
            { error: "Entry ID is required" },
            { status: 400 }
          );
        }

        const entryToDeleteRef = doc(db, "entries", entryIdToDelete);
        const entryToDeleteSnap = await getDoc(entryToDeleteRef);

        if (!entryToDeleteSnap.exists()) {
          return NextResponse.json(
            { error: "Entry not found" },
            { status: 404 }
          );
        }

        // Delete the entry
        await deleteDoc(entryToDeleteRef);

        return NextResponse.json({
          success: true,
          message: "Entry deleted successfully",
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action parameter",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin POST error:", error);
    return NextResponse.json(
      { error: "Failed to process admin request" },
      { status: 500 }
    );
  }
}
