import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyAuKcCS_441tuzhJLL3FlFNQVYVwF2ToG0",
  authDomain: "mock-interview-platform-1c3c1.firebaseapp.com",
  projectId: "mock-interview-platform-1c3c1",
  storageBucket: "mock-interview-platform-1c3c1.firebasestorage.app",
  messagingSenderId: "819274363475",
  appId: "1:819274363475:web:cbdfe5c91a44710c584ca6",
  measurementId: "G-MF9YSY789L"

};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
