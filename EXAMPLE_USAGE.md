# Example: Using Firestore Services in Your Pages

Here's how to use the connected Firestore services in your page components.

## Example 1: Dashboard Page (Fetch User Profile)

```jsx
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getUserDocument } from '@/services'

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      try {
        const data = await getUserDocument(user.uid)
        setProfile(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  if (loading) return <div>Loading profile...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Welcome, {profile?.firstName}!</h1>
      <p>Email: {profile?.email}</p>
      <p>Age: {profile?.isMinor ? 'Minor' : 'Adult'}</p>
    </div>
  )
}
```

## Example 2: Period Tracker (List & Add Periods)

```jsx
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getUserPeriods, addPeriod } from '@/services'

export default function PeriodTracker() {
  const { user } = useAuth()
  const [periods, setPeriods] = useState([])
  const [startDate, setStartDate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchPeriods()
  }, [user])

  const fetchPeriods = async () => {
    try {
      const data = await getUserPeriods(user.uid)
      setPeriods(data)
    } catch (err) {
      console.error('Error fetching periods:', err)
    }
  }

  const handleAddPeriod = async (e) => {
    e.preventDefault()
    if (!startDate) return

    setLoading(true)
    try {
      await addPeriod(user.uid, {
        startDate,
        endDate: null,
        cycleLength: null
      })
      setStartDate('')
      await fetchPeriods() // Refresh list
    } catch (err) {
      console.error('Error adding period:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Period Tracker</h1>
      
      <form onSubmit={handleAddPeriod}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Add Period</button>
      </form>

      <ul>
        {periods.map(period => (
          <li key={period.id}>
            {period.startDate} - {period.endDate || 'ongoing'}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Example 3: Symptom Log (Log Symptoms for Today)

```jsx
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { addSymptomEntry } from '@/services'

const SYMPTOMS = ['cramps', 'headache', 'fatigue', 'mood_swings', 'bloating', 'nausea']

export default function SymptomLog() {
  const { user } = useAuth()
  const [selected, setSelected] = useState([])
  const [painLevel, setPainLevel] = useState(5)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddSymptoms = async () => {
    if (!selected.length) return

    setLoading(true)
    try {
      await addSymptomEntry(user.uid, {
        date: new Date().toISOString().split('T')[0],
        symptoms: selected,
        painLevel: parseInt(painLevel),
        notes
      })
      setSelected([])
      setPainLevel(5)
      setNotes('')
      alert('Symptoms logged!')
    } catch (err) {
      console.error('Error logging symptoms:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSymptom = (symptom) => {
    setSelected(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  return (
    <div>
      <h1>Log Symptoms</h1>
      
      <div>
        <h3>Symptoms</h3>
        {SYMPTOMS.map(symptom => (
          <label key={symptom}>
            <input
              type="checkbox"
              checked={selected.includes(symptom)}
              onChange={() => toggleSymptom(symptom)}
            />
            {symptom.replace('_', ' ')}
          </label>
        ))}
      </div>

      <div>
        <h3>Pain Level: {painLevel}/10</h3>
        <input
          type="range"
          min="1"
          max="10"
          value={painLevel}
          onChange={(e) => setPainLevel(e.target.value)}
        />
      </div>

      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button onClick={handleAddSymptoms} disabled={loading}>
        Log Symptoms
      </button>
    </div>
  )
}
```

## Example 4: User Profile (Edit Profile)

```jsx
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getUserDocument, updateUserDocument } from '@/services'

export default function Profile() {
  const { user } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      const profile = await getUserDocument(user.uid)
      setFirstName(profile?.firstName || '')
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await updateUserDocument(user.uid, { firstName })
      alert('Profile updated!')
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>My Profile</h1>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
      />
      <button onClick={handleUpdate} disabled={loading}>
        Save Changes
      </button>
    </div>
  )
}
```

## Key Patterns

### Pattern 1: Protected Hook Pattern
Always use `useAuth()` in protected pages to access the current user:

```jsx
const { user, loading } = useAuth()

if (loading) return <div>Loading...</div>
if (!user) return <Navigate to="/login" />
```

### Pattern 2: Error Handling
```jsx
try {
  const data = await getUserDocument(uid)
  setData(data)
} catch (err) {
  setError(err.message)
  console.error('Firestore error:', err.code)
}
```

### Pattern 3: Refresh After Mutation
After adding/updating/deleting, re-fetch the data:

```jsx
await addPeriod(...)
await fetchPeriods() // Refresh list
```

### Pattern 4: Loading States
Always show loading state during async operations:

```jsx
const [loading, setLoading] = useState(false)

const handleAction = async () => {
  setLoading(true)
  try {
    await someService()
  } finally {
    setLoading(false)
  }
}

return <button disabled={loading}>
  {loading ? 'Loading...' : 'Click me'}
</button>
```

## Now Implement Your Pages

Update these stub pages with the examples above:
- [ ] `src/pages/dashboard.jsx` — Show user profile
- [ ] `src/pages/periodTracker.jsx` — Log & list periods
- [ ] `src/pages/learn.jsx` (SymptomLog) — Log symptoms
- [ ] `src/pages/profile.jsx` — Edit profile
- [ ] `src/pages/onBoarding.jsx` — First-time setup flow
