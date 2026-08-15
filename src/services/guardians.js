import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc
} from 'firebase/firestore';

// Create a guardian doc with an auto-generated ID — use this when a minor
// signs up and needs to add a guardian for consent.
export async function createGuardian({ name, email, phone, relationship }) {
  const ref = await addDoc(collection(db, 'guardians'), {
    name,
    email,
    phone,
    relationship,
    consentStatus: 'pending',
  });
  return ref.id; // save this as guardianId on the user's doc
}

export async function getGuardian(guardianId) {
  const snap = await getDoc(doc(db, 'guardians', guardianId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Call when the guardian approves/denies consent (e.g. via an emailed link).
export async function updateConsentStatus(guardianId, consentStatus) {
  await updateDoc(doc(db, 'guardians', guardianId), { consentStatus });
}