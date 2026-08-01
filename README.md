# ✈️ OOO Friend

A tiny calendar for tracking when your friends are **out of town** — without
cluttering your main calendar. Each event is just a person's name and the dates
they're away. Two views: **Month** and **Timeline**.

- 📅 **Month view** — a familiar grid; click any day to add a trip, click a
  chip to edit.
- 📊 **Timeline view** — a Gantt-style ribbon of who's away when.
- ✏️ Add, edit, and delete trips.
- ☁️ Data lives in Firebase Firestore and syncs live across devices.

Built with **Svelte 5**, **Tailwind CSS v4**, **Vite**, and **Firebase**.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Firebase setup

The Firebase web config is baked into [`src/lib/firebase.js`](src/lib/firebase.js)
(web API keys are safe to ship in client code — access is controlled by security
rules, not the key). Data is stored in a single `trips` collection.

Enable **Cloud Firestore** in the Firebase console, then publish the rules in
[`firestore.rules`](firestore.rules). These allow open read/write to `trips`
since the app has no login. To lock it down, add Firebase Auth and change the
rule to require `request.auth != null`.

## Data model

A trip document:

```js
{ person: "Alex", start: "2026-08-03", end: "2026-08-09" }
```

Dates are inclusive local `YYYY-MM-DD` strings.
