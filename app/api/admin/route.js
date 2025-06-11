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
  const cookieStore = cookies();
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
    name: admin.name || admin.email.split('@')[0],
    role: admin.role || "admin",
  };
}

// GET - Get admin data and statistics
export async function GET(request) {
  try {
    // Validate admin session
    const admin = await validateAdminSession(request);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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
        const entries = entriesSnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.()?.toISOString() || 
                    docSnap.data().createdAt || 
                    null,
          updatedAt: docSnap.data().updatedAt?.toDate?.()?.toISOString() || 
                    docSnap.data().updatedAt || 
                    null,
        }));

        return NextResponse.json({
          success: true,
          entries,
        });

      case "users":
        // Get all users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const users = usersSnapshot.docs.map(docSnap => ({
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.()?.toISOString() || 
                    docSnap.data().createdAt || 
                    null,
          updatedAt: docSnap.data().updatedAt?.toDate?.()?.toISOString() || 
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
        let settings = {};
        
        if (!settingsSnapshot.empty) {
          const configDoc = settingsSnapshot.docs.find(doc => doc.id === "config");
          if (configDoc) {
            settings = configDoc.data();
          } else {
            // If there's no config document, create default settings
            settings = {
              votingEnabled: true,
              submissionEnabled: true,
              updatedAt: Date.now(),
            };
            await setDoc(doc(db, "settings", "config"), settings);
          }
        } else {
          // Create settings collection and default config if it doesn't exist
          settings = {
            votingEnabled: true,
            submissionEnabled: true,
            updatedAt: Date.now(),
          };
          await setDoc(doc(db, "settings", "config"), settings);
        }

        return NextResponse.json({
          success: true,
          settings,
        });

      case "entry":
        // Get a specific entry by ID
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
          createdAt: entryDocSnap.data().createdAt?.toDate?.()?.toISOString() || 
                   entryDocSnap.data().createdAt || 
                   null,
          updatedAt: entryDocSnap.data().updatedAt?.toDate?.()?.toISOString() || 
                   entryDocSnap.data().updatedAt || 
                   null,
        };

        return NextResponse.json({
          success: true,
          entry,
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const requestBody = await request.json();
    const { action, data } = requestBody;

    switch (action) {
      case "initialize":
        const results = await initializeCollections();
        return NextResponse.json({
          success: true,
          message: "Collections initialization completed",
          results,
        });

      case "reset":
        // Reset specific collections (be careful with this)
        const collections = requestBody.collections;

        if (!collections || !Array.isArray(collections)) {
          return NextResponse.json(
            {
              error: "Collections array is required for reset action",
            },
            { status: 400 }
          );
        }
        
        const resetResults = [];
        for (const collectionName of collections) {
          try {
            const batch = writeBatch(db);
            const snapshot = await getDocs(collection(db, collectionName));

            snapshot.docs.forEach((docSnap) => {
              batch.delete(docSnap.ref);
            });

            await batch.commit();
            resetResults.push({ collection: collectionName, status: "cleared" });
          } catch (error) {
            resetResults.push({
              collection: collectionName,
              status: "error",
              error: error.message,
            });
          }
        }

        return NextResponse.json({
          success: true,
          message: "Collections reset completed",
          results: resetResults,
        });

      case "updateSettings":
        // Update application settings
        const settings = requestBody.settings;

        if (!settings) {
          return NextResponse.json(
            { error: "Settings object is required" },
            { status: 400 }
          );
        }

        // Add update timestamp
        settings.updatedAt = Date.now();

        await setDoc(doc(db, "settings", "config"), settings, { merge: true });

        return NextResponse.json({
          success: true,
          message: "Settings updated successfully",
          settings,
        });

      case "updateEntryStatus":
        // Update entry status (approve/reject)
        const { entryId, status } = requestBody;

        if (!entryId || !status) {
          return NextResponse.json(
            { error: "Entry ID and status are required" },
            { status: 400 }
          );
        }

        const entryRef = doc(db, "entries", entryId);
        await updateDoc(entryRef, {
          status,
          updatedAt: Date.now(),
          updatedBy: admin.id
        });

        return NextResponse.json({
          success: true,
          message: `Entry status updated to ${status}`,
        });

      default:
        return NextResponse.json(
          {
            error: "Invalid action",
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
