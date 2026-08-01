import { writable } from "svelte/store";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase.js";

const trips = collection(db, "trips");

/** @typedef {{ id: string, person: string, start: string, end: string }} Trip */

export const events = writable(/** @type {Trip[]} */ ([]));
export const loading = writable(true);
export const error = writable(/** @type {string | null} */ (null));

// Firestore's WebChannel retries silently (no error callback) when the
// database doesn't exist or the API is disabled, which leaves the UI hanging.
// Surface a helpful hint if the first snapshot hasn't arrived in time.
let connected = false;
const slowTimer = setTimeout(() => {
  if (!connected) {
    error.set(
      "Can't reach Firestore. Make sure Cloud Firestore is enabled for the " +
        "'ooo-friend' project in the Firebase console and that the rules in " +
        "firestore.rules are published."
    );
    loading.set(false);
  }
}, 6000);

onSnapshot(
  trips,
  (snap) => {
    connected = true;
    clearTimeout(slowTimer);
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    list.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
    events.set(list);
    error.set(null);
    loading.set(false);
  },
  (err) => {
    connected = true;
    clearTimeout(slowTimer);
    console.error(err);
    error.set(err.message);
    loading.set(false);
  }
);

export function addEvent({ person, start, end }) {
  return addDoc(trips, { person, start, end });
}

export function updateEvent(id, { person, start, end }) {
  return updateDoc(doc(db, "trips", id), { person, start, end });
}

export function deleteEvent(id) {
  return deleteDoc(doc(db, "trips", id));
}
