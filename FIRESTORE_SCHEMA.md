# Firestore Schema & Services

Your app now writes to Firestore with these collections:

## Collections Overview

### 1. **users/{userId}** 
User profile information (required fields per security rules).

```javascript
{
  name: string,              // Required: user's full name
  email: string,             // User's email address
  dateOfBirth: string,       // ISO date (YYYY-MM-DD)
  isMinor: boolean,          // Whether user is under 18
  createdAt: timestamp       // Auto-set by Firebase
}
```

**Service:**
```javascript
import { createUserDocument, getUserDocument, updateUserDocument } from '@/services'

await createUserDocument(uid, {
  name: 'Jane Doe',
  email: 'jane@example.com',
  dateOfBirth: '2006-05-15',
  isMinor: true
})

const profile = await getUserDocument(uid)
await updateUserDocument(uid, { name: 'Jane Smith' })
```

---

### 2. **cycles/{entryId}**
Period cycle tracking (menstrual cycle data).

```javascript
{
  userId: string,            // User who owns this cycle
  startDate: string,         // ISO date when period started
  endDate: string | null,    // ISO date when period ended (null if ongoing)
  notes: string,             // Optional notes about the cycle
  createdAt: timestamp       // Auto-set by Firebase
}
```

**Service:**
```javascript
import { addCycle, getUserCycles, updateCycle, deleteCycle } from '@/services'

// Add a new cycle
const cycleId = await addCycle(uid, {
  startDate: '2024-08-15',
  endDate: null,
  notes: 'Started cycle'
})

// Get all cycles for user
const cycles = await getUserCycles(uid)  // Most recent first

// Update cycle (e.g., when it ends)
await updateCycle(cycleId, { endDate: '2024-08-20' })

// Delete cycle
await deleteCycle(cycleId)
```

---

### 3. **chatSessions/{sessionId}**
Chat session records (for AI chatbot history).

```javascript
{
  userId: string,            // User who owns this session
  title: string,             // Session title/name
  createdAt: timestamp       // Auto-set by Firebase
}
```

**Service:**
```javascript
import { 
  createChatSession, 
  getUserChatSessions, 
  updateChatSession, 
  deleteChatSession 
} from '@/services'

// Create a new chat session
const sessionId = await createChatSession(uid, { title: 'Chat about cramps' })

// Get all chat sessions for user
const sessions = await getUserChatSessions(uid)

// Update session title
await updateChatSession(sessionId, { title: 'Updated title' })

// Delete session
await deleteChatSession(sessionId)
```

---

### 4. **chatSessions/{sessionId}/messages/{messageId}** (Subcollection)
Messages within a chat session.

```javascript
{
  userId: string,            // User who sent the message
  content: string,           // Message text
  role: string,              // 'user' or 'assistant'
  createdAt: timestamp       // Auto-set by Firebase
}
```

**Service:**
```javascript
import { addMessage, getSessionMessages, deleteMessage } from '@/services'

// Add message to a session
const messageId = await addMessage(sessionId, {
  userId: uid,
  content: 'I have cramping',
  role: 'user'
})

// Get all messages in a session
const messages = await getSessionMessages(sessionId)  // Oldest to newest

// Delete a message
await deleteMessage(sessionId, messageId)
```

---

### 5. **notes/{noteId}**
Personal notes or reminders.

```javascript
{
  userId: string,            // User who owns this note
  title: string,             // Note title
  content: string,           // Note content
  tags: string[],            // Optional tags for organization
  createdAt: timestamp       // Auto-set by Firebase
}
```

**Service:**
```javascript
import { addNote, getUserNotes, updateNote, deleteNote } from '@/services'

// Add a note
const noteId = await addNote(uid, {
  title: 'My reminders',
  content: 'Take vitamin D daily',
  tags: ['health', 'reminders']
})

// Get all notes for user
const notes = await getUserNotes(uid)  // Most recent first

// Update note
await updateNote(noteId, { content: 'Updated content' })

// Delete note
await deleteNote(noteId)
```

---

## Security Rules Enforced

Your Firestore rules ensure:

✅ **User Isolation** — Users can only access their own data (userId must match auth.uid)
✅ **Authentication Required** — All writes require logged-in user (except public collections)
✅ **Data Validation** — `createdAt` is required when creating documents
✅ **Public Collections** — `resources` and `supportInfo` are readable by everyone (read-only)

---

## How to Use in Your Pages

### Example: Dashboard (Show user profile)
```jsx
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getUserDocument } from '@/services'

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!user) return
    getUserDocument(user.uid).then(setProfile)
  }, [user])

  return <div>Welcome, {profile?.name}!</div>
}
```

### Example: Period Tracker (List & add cycles)
```jsx
import { addCycle, getUserCycles } from '@/services'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'

export default function PeriodTracker() {
  const { user } = useAuth()
  const [cycles, setCycles] = useState([])
  const [startDate, setStartDate] = useState('')

  useEffect(() => {
    if (!user) return
    getUserCycles(user.uid).then(setCycles)
  }, [user])

  const handleAddCycle = async () => {
    if (!startDate) return
    await addCycle(user.uid, { startDate, endDate: null })
    setStartDate('')
    const updated = await getUserCycles(user.uid)
    setCycles(updated)
  }

  return (
    <div>
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <button onClick={handleAddCycle}>Add Cycle</button>
      <ul>
        {cycles.map(c => <li key={c.id}>{c.startDate}</li>)}
      </ul>
    </div>
  )
}
```

### Example: Chat Feature (Create session & add messages)
```jsx
import { createChatSession, addMessage, getSessionMessages } from '@/services'
import { useAuth } from '@/hooks/useAuth'

export default function ChatPage() {
  const { user } = useAuth()

  const handleNewChat = async () => {
    const sessionId = await createChatSession(user.uid, { title: 'New Chat' })
    // Redirect to chat page with sessionId
  }

  const handleSendMessage = async (sessionId, text) => {
    await addMessage(sessionId, {
      userId: user.uid,
      content: text,
      role: 'user'
    })
    // Refresh messages
    const messages = await getSessionMessages(sessionId)
  }
}
```

---

## Setup Checklist

- [ ] Set Firestore security rules (use `firestore.rules` file)
- [ ] Deploy rules via Firebase Console or CLI
- [ ] Test signup — user document should appear in Firestore
- [ ] Implement dashboard page
- [ ] Implement period tracker page
- [ ] Implement chat page (optional)
- [ ] Implement notes page (optional)

---

## Troubleshooting

### Signup succeeds but no Firestore doc
→ Security rules are blocking writes. Go to Firebase Console → Firestore → Rules and deploy the rules from `firestore.rules`

### "Permission denied" error
→ Check that `userId` field matches authenticated user's `uid`

### Data not appearing
→ Open Firestore Console to verify documents are being created
→ Check browser console for error messages
