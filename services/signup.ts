// services/signup.ts
import { auth, db } from '@/firebase/client';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface SignupData {
  username: string;
  email: string;
  password: string;
}

export const signUpUser = async ({ username, email, password }: SignupData) => {
  try {
    console.log('Signup attempt:', { username, email });

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Firebase Auth user created:', user.uid);

    // Save additional info in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      createdAt: new Date(),
    });
    console.log('User data saved in Firestore');

    return { success: true, user };
  } catch (error: any) {
    console.error('Signup error:', error);
    return { success: false, error: error.message };
  }
};
