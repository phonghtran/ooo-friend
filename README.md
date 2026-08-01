# ✈️ OOO Friend

A tiny calendar for tracking when your friends are **out of town** — without
cluttering your main calendar. Each event is just a person's name and the dates
they're away. Two views: **Month** and **Timeline**.

- 📅 **Month view** — a familiar grid; click any day to add a trip, click a
  chip to edit.
- 📊 **Timeline view** — a Gantt-style ribbon of who's away when.
- ✏️ Add, edit, and delete trips.
- 🔒 **Email/password sign-in** — each account sees only its own trips.
- ☁️ Data lives in Firebase Firestore and syncs live across devices.

Built with **Svelte 5**, **Tailwind CSS v4**, **Vite**, and **Firebase**
(Auth + Firestore).

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173) and create an
account.

## Build

```bash
npm run build
npm run preview
```

## Firebase

Config lives in local files and deploys via the Firebase CLI — no clicking
around the console:

- [`firebase.json`](firebase.json) — Firestore rules/indexes + Hosting.
- [`.firebaserc`](.firebaserc) — pins the default project to `ooo-friend`.
- [`firestore.rules`](firestore.rules) — a signed-in user can only read/write
  their own trips under `users/{uid}/trips`.
- [`firestore.indexes.json`](firestore.indexes.json) — (none needed yet).

Deploy:

```bash
firebase deploy --only firestore:rules   # security rules
firebase deploy --only hosting           # runs the build, then publishes dist/
firebase deploy                          # everything
```

The web config is baked into [`src/lib/firebase.js`](src/lib/firebase.js). Web
API keys are safe to ship in client code — access is controlled by the security
rules, not the key.

### One thing the CLI can't do

Enabling the **Email/Password** sign-in provider is a one-time step in the
Firebase console (**Authentication → Get Started → Email/Password → Enable**).
On the free (Spark) plan, Firebase doesn't expose this over `firebase deploy` or
the public API — the API path requires enabling billing (Identity Platform).
Everything else in this project stays in local, deployable files.

## Data model

Each user's trips are stored at `users/{uid}/trips/{tripId}`:

```js
{ person: "Alex", start: "2026-08-03", end: "2026-08-09" }
```

Dates are inclusive local `YYYY-MM-DD` strings.
