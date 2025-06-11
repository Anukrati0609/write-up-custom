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

// Database schema and initial setup
const DATABASE_SCHEMA = {
  users: {
    description: "User profiles and authentication data",
    fields: {
      uid: "string (Firebase Auth UID)",
      email: "string",
      displayName: "string",
      photoURL: "string",
      is_submitted: "boolean",
      is_voted: "boolean",
      votedFor: "string (entry ID)",
      createdAt: "timestamp",
      updatedAt: "timestamp",
    },
  },
  entries: {
    description: "Writing competition entries",
    fields: {
      id: "string (entry_<userId>)",
      userId: "string",
      authorName: "string",
      year: "string",
      branch: "string",
      title: "string",
      content: "string (HTML)",
      votes: "number",
      voters: "array of user IDs",
      createdAt: "timestamp",
      updatedAt: "timestamp",
    },
  },
  votes: {
    description: "Vote tracking records",
    fields: {
      id: "string (vote_<userId>_<entryId>)",
      voterId: "string",
      entryId: "string",
      entryAuthor: "string",
      createdAt: "timestamp",
    },
  },
  settings: {
    description: "Application settings and configuration",
    fields: {
      key: "string",
      value: "any",
      description: "string",
      updatedAt: "timestamp",
    },
  },
};

async function initializeDatabase() {
  const results = [];

  try {
    // Initialize each collection
    for (const [collectionName, schema] of Object.entries(DATABASE_SCHEMA)) {
      try {
        // Check if collection exists
        const testQuery = query(collection(db, collectionName), limit(1));
        const testDoc = await getDocs(testQuery);

        if (testDoc.empty) {
          // Create collection with schema document
          const schemaDocRef = doc(db, collectionName, "_schema");
          await setDoc(schemaDocRef, {
            ...schema,
            createdAt: new Date(),
            isSchema: true,
          });

          results.push({
            collection: collectionName,
            status: "created",
            description: schema.description,
          });
        } else {
          results.push({
            collection: collectionName,
            status: "exists",
            documentCount: testDoc.size,
          });
        }
      } catch (error) {
        results.push({
          collection: collectionName,
          status: "error",
          error: error.message,
        });
      }
    }

    // Create initial settings
    const settingsRef = collection(db, "settings");
    const initialSettings = [
      {
        key: "competition_status",
        value: "active",
        description: "Competition status: active, voting, closed",
      },
      {
        key: "max_word_count",
        value: 1500,
        description: "Maximum word count for entries",
      },
      {
        key: "min_word_count",
        value: 1000,
        description: "Minimum word count for entries",
      },
      {
        key: "voting_enabled",
        value: true,
        description: "Whether voting is currently enabled",
      },
    ];
    for (const setting of initialSettings) {
      const settingDocRef = doc(db, "settings", setting.key);
      const settingDoc = await getDoc(settingDocRef);
      if (!settingDoc.exists()) {
        await setDoc(settingDocRef, {
          ...setting,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return {
      success: true,
      message: "Database initialized successfully",
      results,
      schema: DATABASE_SCHEMA,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      results,
    };
  }
}

export async function GET(request) {
  try {
    const result = await initializeDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize database",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { action } = await request.json();

    if (action === "force_init") {
      // Force re-initialization
      const result = await initializeDatabase();
      return NextResponse.json(result);
    }

    if (action === "check_health") {
      // Check database health
      const health = {};
      for (const collectionName of Object.keys(DATABASE_SCHEMA)) {
        try {
          const snapshot = await getDocs(collection(db, collectionName));
          health[collectionName] = {
            exists: true,
            documentCount: snapshot.size,
            status: "healthy",
          };
        } catch (error) {
          health[collectionName] = {
            exists: false,
            error: error.message,
            status: "error",
          };
        }
      }

      return NextResponse.json({
        success: true,
        health,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        error: "Invalid action",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Database setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
      },
      { status: 500 }
    );
  }
}
