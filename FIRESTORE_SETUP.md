# Firestore Services Connected ✅

Your Firestore services are now fully integrated with your React app. Here's what's connected:

## Architecture Overview

### Firebase Configuration
- **Location**: `src/lib/firebase.js`
- **Project ID**: `menacare-b2fba`
- **Services**: Authentication + Firestore Database

### Firestore Services

All services are located in `src/services/` and import from `src/lib/firebase.js`:

#### 1. **Users Service** (`src/services/users.js`)
Manages user profiles in the `users` collection.

```javascript
import { createUserDocument, getUserDocument, updateUserDocument } from '@/services'

// Create user doc after signup
await createUserDocument(uid, {
  firstName: 'Jane',
  dateOfBirth: '1990-01-15',
  email: 'jane@example.com',
  isMinor: false,
  guardianId: null
})

// Get user profile
const profile = await getUserDocument(uid)

// Update profile fields
await updateUserDocument(uid, { firstName: 'Janet' })
```

**Firestore Schema:**
```
users/{uid}
├── firstName: string
├── email: string
├── dateOfBirth: string (ISO date)
├── isMinor: boolean
├── guardianId: string (null if adult)
└── createdAt: timestamp
```

#### 2. **Periods Service** (`src/services/periods.js`)
Tracks menstrual cycle periods for each user.

```javascript
import { addPeriod, getUserPeriods, updatePeriod, deletePeriod } from '@/services'

// Log a new period
const periodId = await addPeriod(uid, {
  startDate: '2024-01-15',
  endDate: '2024-01-20',
  cycleLength: 28
})

// Get user's period history
const periods = await getUserPeriods(uid) // sorted by most recent

// Update when period ends
await updatePeriod(periodId, { endDate: '2024-01-20' })

// Delete a period entry
await deletePeriod(periodId)
```

**Firestore Schema:**
```
periods/{id}
├── userId: string
├── startDate: string (ISO date)
├── endDate: string | null
├── cycleLength: number | null
└── createdAt: timestamp
```

#### 3. **Guardians Service** (`src/services/guardians.js`)
Manages guardian consent for minor users.

```javascript
import { createGuardian, getGuardian, updateConsentStatus } from '@/services'

// Create guardian record during minor signup
const guardianId = await createGuardian({
  name: 'Mary Doe',
  email: 'mary@example.com',
  phone: '+27 12 345 6789',
  relationship: 'Mother'
})

// Get guardian details
const guardian = await getGuardian(guardianId)

// Update consent (pending → approved/declined)
await updateConsentStatus(guardianId, 'approved')
```

**Firestore Schema:**
```
guardians/{id}
├── name: string
├── email: string
├── phone: string
├── relationship: string
├── consentStatus: 'pending' | 'approved' | 'declined'
└── createdAt: timestamp (optional)
```

#### 4. **Symptoms Service** (`src/services/symptoms.js`)
Logs menstrual symptoms like cramps, headaches, etc.

```javascript
import { addSymptomEntry, getUserSymptoms, updateSymptomEntry, deleteSymptomEntry } from '@/services'

// Log symptoms for a specific date
const symptomId = await addSymptomEntry(uid, {
  date: '2024-01-15',
  symptoms: ['cramps', 'headache', 'fatigue'],
  painLevel: 7,
  notes: 'Severe cramps today'
})

// Get all symptoms for user
const symptoms = await getUserSymptoms(uid) // sorted by most recent

// Update symptoms
await updateSymptomEntry(symptomId, { painLevel: 5 })

// Delete symptoms
await deleteSymptomEntry(symptomId)
```

**Firestore Schema:**
```
symptoms/{id}
├── userId: string
├── date: string (ISO date)
├── symptoms: string[] (e.g. ['cramps', 'headache'])
├── painLevel: number (1-10)
├── notes: string
└── createdAt: timestamp (optional)
```

## Routes Connected

Your app now has the following protected routes:

- `/login` — Login page (public)
- `/signup` — Sign up page (public)
- `/` — Redirects to dashboard if logged in, else login
- `/dashboard` — Main dashboard (protected)
- `/onboarding` — Onboarding flow (protected)
- `/period-tracker` — Period logging (protected)
- `/symptom-log` — Symptom tracking (protected)
- `/profile` — User profile (protected)
- `/guardian-consent/:guardianId` — Guardian consent link (public, for email links)

## Authentication Flow

1. **Login/SignUp**: User authenticates with Firebase Auth
2. **User Document**: Created in Firestore `users/{uid}` collection
3. **Guardian Link** (minors): If user is < 18, guardian doc created and linked
4. **Protected Routes**: Use `AuthContext` to check authentication status

## Clean Imports

Services are barrel-exported from `src/services/index.js`:

```javascript
import { 
  createUserDocument, 
  getUserPeriods, 
  createGuardian,
  addSymptomEntry 
} from '@/services'
```

## Next Steps

1. **Create page components** for dashboard, period-tracker, etc.
2. **Implement auth persistence** to keep users logged in after refresh
3. **Add loading states** in pages before fetching data
4. **Set Firestore rules** for secure read/write access
5. **Test workflows**:
   - Adult signup → user created → redirect to dashboard
   - Minor signup → user + guardian created → redirect to guardian consent
   - Log in → fetch user profile → show dashboard

## Important Notes

⚠️ **Firebase Config**: Your `src/lib/firebase.js` has hardcoded credentials. This is fine for frontend (they're meant to be public), but:
- Never commit API keys to `.env` that shouldn't be public
- Use Firestore Security Rules to protect data

⚠️ **Firestore Security**: By default, Firestore denies all reads/writes. You need to:
1. Set rules in Firebase Console
2. Basic rule for testing:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth.uid == uid;
       }
       match /periods/{doc=**} {
         allow read, write: if request.auth.uid == resource.data.userId;
       }
       match /symptoms/{doc=**} {
         allow read, write: if request.auth.uid == resource.data.userId;
       }
       match /guardians/{guardianId} {
         allow read: if request.auth != null;
         allow write: if request.auth.uid == resource.data.userId;
       }
     }
   }
   ```
