import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

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

// Create the Firestore users/{uid} doc right after signup.
// Accepts either the new shape ({ firstName, dateOfBirth, isMinor, guardianId })
// or the older { name } shape — both normalize to the same schema.
export async function createUserDocument(uid, userData = {}) {
  await setDoc(doc(db, 'users', uid), {
    firstName: userData.firstName ?? userData.name ?? '',
    email: userData.email ?? '',
    dateOfBirth: userData.dateOfBirth ?? null,
    isMinor: userData.isMinor ?? false,
    guardianId: userData.guardianId ?? null,
    createdAt: serverTimestamp(),
  });
}

// Fetch a user's profile — use after login to populate the dashboard.
export async function getUserDocument(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Create a guardian doc (auto-generated ID) for minor signups needing consent.
// Returns the new guardianId so it can be saved onto the user's doc.
export async function createGuardian({ name, email, phone, relationship }) {
  const ref = await addDoc(collection(db, 'guardians'), {
    name,
    email,
    phone,
    relationship,
    consentStatus: 'pending',
  });
  return ref.id;
}