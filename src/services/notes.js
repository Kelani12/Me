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
  serverTimestamp,
} from 'firebase/firestore';

// Add a note
export async function addNote(userId, { title, content, tags = [] }) {
  const ref = await addDoc(collection(db, 'notes'), {
    userId,
    title,
    content,
    tags,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Get all notes for a user
export async function getUserNotes(userId) {
  const q = query(
    collection(db, 'notes'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Update a note
export async function updateNote(noteId, updates) {
  await updateDoc(doc(db, 'notes', noteId), updates);
}

// Delete a note
export async function deleteNote(noteId) {
  await deleteDoc(doc(db, 'notes', noteId));
}
