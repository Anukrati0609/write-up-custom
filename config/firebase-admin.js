import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin only if it hasn't been initialized already
let adminApp;

if (!getApps().length) {
  try {
    // Try to use service account key if available
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      );
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: "write-it-up-c77af",
      });
      console.log("Firebase Admin initialized with service account");
    } else {
      // Fallback to regular config (for development)
      adminApp = initializeApp({
        apiKey: "AIzaSyAebhnjEQ_lyLmNvYfDIlry67r349-Z6TM",
        authDomain: "write-it-up-c77af.firebaseapp.com",
        projectId: "write-it-up-c77af",
        storageBucket: "write-it-up-c77af.firebasestorage.app",
        messagingSenderId: "200949648682",
        appId: "1:200949648682:web:c16eb718696416eef1e253",
        measurementId: "G-BKS0HS26VR",
      });
      console.log("Firebase Admin initialized with API key");
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    // Fallback initialization
    adminApp = initializeApp({
      projectId: "write-it-up-c77af",
    });
  }
} else {
  adminApp = getApps()[0];
}

const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

// Function to test database connection
export async function testConnection() {
  try {
    await adminDb.collection("test").doc("connection").set({
      timestamp: new Date(),
      status: "connected",
    });
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export { adminAuth, adminDb };
