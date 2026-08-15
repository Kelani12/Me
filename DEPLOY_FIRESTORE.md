# Deploy Firestore Rules (CRITICAL)

**⚠️ IMPORTANT:** By default, Firestore blocks all reads/writes. You MUST deploy security rules for the app to write data.

## Quick Deploy (2 minutes)

### Option A: Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project **menacare-b2fba**
3. Click **Firestore Database** (left menu)
4. Click **Rules** tab (top)
5. Clear existing rules and paste contents of `firestore.rules` from this repo
6. Click **Publish**

✅ Done! Your app can now write to Firestore.

---

### Option B: Firebase CLI

```bash
# Install (first time only)
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

---

## Verify It Works

### 1. Test Signup
1. Run `npm run dev`
2. Go to http://localhost:5173/signup
3. Create account with:
   - Name: Jane Doe
   - Email: jane@example.com
   - Date of Birth: 2006-05-15 (to trigger "minor")
   - Password: Test123!@

4. Check success message appears

### 2. Verify Firestore Document Created
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **menacare-b2fba** project
3. Click **Firestore Database**
4. Look for `users` collection
5. Should see document with uid as ID containing:
   ```
   {
     name: "Jane Doe",
     email: "jane@example.com",
     dateOfBirth: "2006-05-15",
     isMinor: true,
     createdAt: [timestamp]
   }
   ```

✅ If you see this, Firestore rules are working!

---

## Rules Breakdown

Your `firestore.rules` file:

```javascript
// User profiles — must have 'name' and 'createdAt'
match /users/{userId} {
  allow create: if isOwner(userId) && isValidUserData();
  allow read, update, delete: if isOwner(userId);
}

// Period cycles — userId must match auth user
match /cycles/{entryId} {
  allow create: if isSignedIn() &&
    request.resource.data.userId == request.auth.uid;
  allow read, update, delete: if isSignedIn() &&
    resource.data.userId == request.auth.uid;
}

// Chat sessions — userId must match auth user
match /chatSessions/{sessionId} {
  allow create: if isSignedIn() &&
    request.resource.data.userId == request.auth.uid;
  allow read, update, delete: if isSignedIn() &&
    resource.data.userId == request.auth.uid;
}

// Messages in chat — userId must match auth user
match /chatSessions/{sessionId}/messages/{messageId} {
  allow create: if isSignedIn() &&
    request.resource.data.userId == request.auth.uid;
  allow read, update, delete: if isSignedIn() &&
    resource.data.userId == request.auth.uid;
}

// Personal notes — userId must match auth user
match /notes/{noteId} {
  allow create: if isSignedIn() &&
    request.resource.data.userId == request.auth.uid;
  allow read, update, delete: if isSignedIn() &&
    resource.data.userId == request.auth.uid;
}

// Public read-only collections
match /resources/{resourceId} {
  allow read: if true;
}
match /supportInfo/{docId} {
  allow read: if true;
}
```

**What this means:**
- Only authenticated users can write (except public collections)
- Users can only access their own data
- userId field must match the authenticated user's uid
- createdAt timestamps are validated

---

## Common Issues

### "Firestore is not writable" error
**Problem:** You see errors in browser console about permission denied
**Solution:** Deploy the rules from `firestore.rules` file (follow steps above)

### Signup completes but no Firestore doc appears
**Problem:** No error in console, but Firestore Console shows no `users` collection
**Solution:** Rules not deployed yet — complete the deploy steps above

### "missing" createdAt field
**Problem:** Firestore doc created but incomplete
**Solution:** Make sure you're using `serverTimestamp()` when calling `createUserDocument()`

---

## After Deploying Rules

Your app now:

✅ Creates user profiles in Firestore on signup
✅ Allows users to log periods/cycles
✅ Allows users to create chat sessions
✅ Allows users to save personal notes
✅ Prevents users from accessing other users' data
✅ Prevents unauthenticated access to private data

---

## What's Next

1. **Deploy rules** (if not done already)
2. Test signup flow → check Firestore Console
3. Implement dashboard page to display user profile
4. Implement period tracker page to log cycles
5. Implement chat page (if using chatbot feature)
6. Implement notes page (if using notes feature)

See `FIRESTORE_SCHEMA.md` for service usage examples in your pages.
