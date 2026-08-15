import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

// symptoms: array of strings, e.g. ['cramps', 'headache']
export async function addSymptomEntry(userId, { date, symptoms, painLevel, notes = '' }) {
  const ref = await addDoc(collection(db, 'symptoms'), {
    userId,
    date,
    symptoms,
    painLevel,
    notes,
  });
  return ref.id;
}

export async function getUserSymptoms(userId) {
  const q = query(
    collection(db, 'symptoms'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateSymptomEntry(symptomId, updates) {
  await updateDoc(doc(db, 'symptoms', symptomId), updates);
}

export async function deleteSymptomEntry(symptomId) {
  await deleteDoc(doc(db, 'symptoms', symptomId));
}