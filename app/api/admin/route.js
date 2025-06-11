import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/config/firebase-admin";

// Function to initialize all required collections
async function initializeCollections() {
  const collections = ["users", "entries", "votes", "settings"];
  const results = [];

  for (const collectionName of collections) {
    try {
      const testDoc = await adminDb.collection(collectionName).limit(1).get();
      if (testDoc.empty) {
        const tempDocRef = adminDb.collection(collectionName).doc("temp");
        await tempDocRef.set({ temp: true, createdAt: new Date() });
        await tempDocRef.delete();
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

// GET - Get database statistics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "stats") {
      // Get collection statistics
      const stats = {};

      const collections = ["users", "entries", "votes"];
      for (const collectionName of collections) {
        try {
          const snapshot = await adminDb.collection(collectionName).get();
          stats[collectionName] = {
            count: snapshot.size,
            documents: snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              createdAt:
                doc.data().createdAt?.toDate?.()?.toISOString() || null,
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
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action parameter",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin GET error:", error);
    return NextResponse.json(
      { error: "Failed to process admin request" },
      { status: 500 }
    );
  }
}

// POST - Initialize collections or perform admin actions
export async function POST(request) {
  try {
    const { action, data } = await request.json();

    if (action === "initialize") {
      const results = await initializeCollections();

      return NextResponse.json({
        success: true,
        message: "Collections initialization completed",
        results,
      });
    }

    if (action === "reset") {
      // Reset specific collections (be careful with this)
      const { collections } = data || {};

      if (!collections || !Array.isArray(collections)) {
        return NextResponse.json(
          {
            error: "Collections array is required for reset action",
          },
          { status: 400 }
        );
      }

      const results = [];
      for (const collectionName of collections) {
        try {
          const batch = adminDb.batch();
          const snapshot = await adminDb.collection(collectionName).get();

          snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });

          await batch.commit();
          results.push({ collection: collectionName, status: "cleared" });
        } catch (error) {
          results.push({
            collection: collectionName,
            status: "error",
            error: error.message,
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: "Collections reset completed",
        results,
      });
    }

    return NextResponse.json(
      {
        error: "Invalid action",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin POST error:", error);
    return NextResponse.json(
      { error: "Failed to process admin request" },
      { status: 500 }
    );
  }
}
