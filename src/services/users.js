import { db } from '../lib/firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

// Create the Firestore profile doc right after signup.
// Call this AFTER createUserWithEmailAndPassword succeeds, using the returned uid.
// Example: await createUserDocument(userCredential.user.uid, { name: 'Jane Doe', email, dateOfBirth, isMinor })
export async function createUserDocument(uid, { name, email, dateOfBirth = null, isMinor = false }) {
  await setDoc(doc(db, 'users', uid), {
    name,
    email,
    dateOfBirth,
    isMinor,
    createdAt: serverTimestamp(),
  });
}

// Fetch a single user's profile — use after login to populate the dashboard.
export async function getUserDocument(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Partial update (e.g. editing profile fields).
export async function updateUserDocument(uid, updates) {
  await updateDoc(doc(db, 'users', uid), updates);
}

// Delete user document
export async function deleteUserDocument(uid) {
  await deleteDoc(doc(db, 'users', uid));
}