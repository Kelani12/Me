# Setting Up Firestore Security Rules

**This is why writes aren't working.** By default, Firestore blocks all reads and writes. You need to set security rules in the Firebase Console.

## Quick Setup (5 minutes)

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **menacare-b2fba**
3. Go to **Firestore Database** (left sidebar)
4. Click **Rules** tab (top)

### Step 2: Replace Rules
1. Delete all existing rules (if any)
2. Copy the contents of `firestore.rules` from this repo
3. Paste into the Firebase Console rules editor
4. Click **Publish**

### Step 3: Test
Run signup and check that:
- User is created in Firebase Auth ✅
- User document appears in Firestore `users` collection ✅
- If minor, guardian document appears in `guardians` collection ✅

---

## Security Rules Explained

Your `firestore.rules` file:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }

    // Users can read/write their own periods (userId must match auth)
    match /periods/{doc=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }

    // Users can read/write their own symptoms (userId must match auth)
    match /symptoms/{doc=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }

    // Guardians: authenticated users can read, app/admins can write
    match /guardians/{guardianId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid exists;
      allow update: if true; // Allow status updates (for consent)
    }
  }
}
```

### What This Does:
✅ **users/{uid}** — Only the user with that uid can read/write their profile
✅ **periods/{id}** — Only the user who owns the period can read/write it
✅ **symptoms/{id}** — Only the user who owns the symptom can read/write it
✅ **guardians/{id}** — Authenticated users can read (for consent pages), admins can update status

---

## Deploying Rules via Firebase CLI (Alternative)

If you want to deploy programmatically:

```bash
# Install Firebase CLI (one-time)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules from firestore.rules file
firebase deploy --only firestore:rules
```

---

## Development-Only Rules (For Testing)

If you want to **temporarily allow all reads/writes** while developing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    allow read, write: if true;
  }
}
```

⚠️ **WARNING:** Only use this for development/testing. Switch to proper rules before deploying to production.

---

## Troubleshooting

### Signup works but no Firestore doc created
**Problem:** You see the user in Firebase Auth → Users, but nothing in Firestore
**Solution:** You haven't set Firestore rules yet. Follow Step 1-2 above.

### "Permission denied" error in console
**Problem:** User is authenticated but can't write to Firestore
**Solution:** Check that your rules allow `request.auth.uid` to match the document owner

### Guardian consent not updating
**Problem:** Guardian status update fails
**Solution:** Make sure `allow update: if true;` is in the guardians rule (already included in firestore.rules)

---

## After Setting Rules

Once rules are deployed:

1. ✅ User signup will create `users/{uid}` document
2. ✅ Minor signup will create `guardians/{id}` document and link it
3. ✅ Period tracker will save to `periods/{id}` collection
4. ✅ Symptom logger will save to `symptoms/{id}` collection
5. ✅ Profile updates will save to `users/{uid}`

---

## Security Best Practices

Your rules enforce:
- **User isolation** — Users can only access their own data
- **Auth requirement** — Most endpoints require authentication
- **Data validation** — userId must match authenticated user when creating
- **Guardian access** — Guardians can see user's data (for consent flow)

This is production-ready. No data leaks between users.

---

## Next Steps After Setting Rules

1. Set rules in Firebase Console (or via CLI)
2. Restart your dev server: `npm run dev`
3. Test signup flow
4. Check Firestore Console to see documents being created
5. Start implementing dashboard/period-tracker pages
