# IVAC License Manager — Firebase Auth + Firestore

This version uses:

- Firebase Authentication
- Cloud Firestore
- Chrome Extension Manifest V3
- React + TypeScript + Vite
- No Cloud Functions
- No custom backend

## 1. Create Firebase project

Create a Firebase project in Firebase Console.

Enable:

- Authentication → Email/Password
- Firestore Database

Add a Web App and copy its configuration.

## 2. Configure environment

Copy `.env.example` to `.env` and fill in the Firebase Web App values.

## 3. Create admin account

Use Firebase Authentication → Users → Add user.

The email/password created there is used by the extension login.

This starter treats every authenticated Firebase user as an admin. If only one administrator exists, keep it private.

## 4. Firestore

Deploy rules/indexes with Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore
```

Or paste `firestore.rules` into the Firebase Console Rules tab.

## 5. Build

```bash
npm install
npm run build
```

Load:

`dist/`

from:

`chrome://extensions`

with Developer mode enabled.

## Firestore collections

```text
users/{uid}

licenses/{licenseId}

licenseActivations/{activationId}

licenseEvents/{eventId}

settings/license
```

## Customer extension

The customer IVAC extension can use the same Firebase project and the exported functions in:

`src/services/license.service.ts`

The important functions are:

- `activateLicense()`
- `validateLicense()`

For production, do not allow arbitrary users to read/write every license. The included rules are intentionally simple for a single-admin manager. If customers will have Firebase accounts, tighten rules around ownership before launch.

## No Cloud Functions

There is no `functions/` directory and no server code.

All license generation and management happens from the extension, while Firestore provides shared persistence and Firebase Auth provides administrator authentication.

## Security limitation

Because license generation happens in the extension, the generation algorithm is visible to users who inspect the extension. Because Firestore is accessed directly from the client, Firestore Security Rules are critical.

For stronger anti-tampering protection, a trusted server/Cloud Function would eventually be preferable.
