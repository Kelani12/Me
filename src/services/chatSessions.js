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
  getDoc,
} from 'firebase/firestore';

// Create a new chat session
export async function createChatSession(userId, { title = 'Chat Session' }) {
  const ref = await addDoc(collection(db, 'chatSessions'), {
    userId,
    title,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Get all chat sessions for a user
export async function getUserChatSessions(userId) {
  const q = query(
    collection(db, 'chatSessions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Get a specific chat session
export async function getChatSession(sessionId) {
  const snap = await getDoc(doc(db, 'chatSessions', sessionId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update chat session (e.g. title)
export async function updateChatSession(sessionId, updates) {
  await updateDoc(doc(db, 'chatSessions', sessionId), updates);
}

// Delete chat session
export async function deleteChatSession(sessionId) {
  await deleteDoc(doc(db, 'chatSessions', sessionId));
}

// Add a message to a chat session
export async function addMessage(sessionId, { userId, content, role = 'user' }) {
  const ref = await addDoc(collection(db, 'chatSessions', sessionId, 'messages'), {
    userId,
    content,
    role, // 'user' or 'assistant'
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Get all messages in a chat session
export async function getSessionMessages(sessionId) {
  const q = query(
    collection(db, 'chatSessions', sessionId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Delete a message
export async function deleteMessage(sessionId, messageId) {
  await deleteDoc(doc(db, 'chatSessions', sessionId, 'messages', messageId));
}
