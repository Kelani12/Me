import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

// Log a new cycle entry.
export async function addCycle(userId, { startDate, endDate = null, notes = '' }) {
  const ref = await addDoc(collection(db, 'cycles'), {
    userId,
    startDate,
    endDate,
    notes,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Get all cycles for a user, most recent first.
export async function getUserCycles(userId) {
  const q = query(
    collection(db, 'cycles'),
    where('userId', '==', userId),
    orderBy('startDate', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Update a cycle entry (e.g. setting endDate).
export async function updateCycle(cycleId, updates) {
  await updateDoc(doc(db, 'cycles', cycleId), updates);
}

// Delete a cycle entry.
export async function deleteCycle(cycleId) {
  await deleteDoc(doc(db, 'cycles', cycleId));
}
