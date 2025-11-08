import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
// Ensure the correct path to your Firebase client file; for example:
import { db } from "../firebase/client";
// Or, if your firebase client is in a different location, update the path accordingly.

export const saveInterview = async (data: {
  userId: string;
  role: string;
  level: string;
  techStack: string[];
  questions: string[];
}) => {
  try {
    const docRef = await addDoc(collection(db, "interviews"), {
      ...data,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving interview:", error);
    throw error;
  }
};

export const getInterviewsByUserId = async (userId: string) => {
  const q = query(
    collection(db, "interviews"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};