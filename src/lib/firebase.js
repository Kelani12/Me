import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_ww_y4JugNrNUwcfNmDVi7rcVXtMOk0c",
  authDomain: "menacare-b2fba.firebaseapp.com",
  projectId: "menacare-b2fba",
  storageBucket: "menacare-b2fba.firebasestorage.app",
  messagingSenderId: "230822743231",
  appId: "1:230822743231:web:cb07afa9b43144f9ffca0a",
  measurementId: "G-G1GG58J57F"
};

const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Firestore Database
export const db = getFirestore(app);

// Create a user document in Firestore
export async function createUserDocument(uid, userData) {
  await setDoc(doc(db, "users", uid), {
    ...userData,
    createdAt: serverTimestamp(),
  });
}

// Get users from Firestore
export async function getUsers() {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}