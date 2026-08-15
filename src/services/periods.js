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

// Log a new period entry.
export async function addPeriod(userId, { startDate, endDate = null, cycleLength = null }) {
  const ref = await addDoc(collection(db, 'periods'), {
    userId,
    startDate,
    endDate,
    cycleLength,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Get all periods for a user, most recent first — for the cycle history / dashboard.
export async function getUserPeriods(userId) {
  const q = query(
    collection(db, 'periods'),
    where('userId', '==', userId),
    orderBy('startDate', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// E.g. setting endDate once the period finishes.
export async function updatePeriod(periodId, updates) {
  await updateDoc(doc(db, 'periods', periodId), updates);
}

export async function deletePeriod(periodId) {
  await deleteDoc(doc(db, 'periods', periodId));
}