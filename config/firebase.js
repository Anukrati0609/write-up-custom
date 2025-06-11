// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAebhnjEQ_lyLmNvYfDIlry67r349-Z6TM",
  authDomain: "write-it-up-c77af.firebaseapp.com",
  projectId: "write-it-up-c77af",
  storageBucket: "write-it-up-c77af.firebasestorage.app",
  messagingSenderId: "200949648682",
  appId: "1:200949648682:web:c16eb718696416eef1e253",
  measurementId: "G-BKS0HS26VR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, analytics };
