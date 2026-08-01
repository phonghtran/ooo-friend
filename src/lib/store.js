import { writable, get } from "svelte/store";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase.js";
import { user } from "./auth.js";

/** @typedef {{ id: string, person: string, start: string, end: string }} Trip */

export const events = writable(/** @type {Trip[]} */ ([]));
export const loading = writable(true);
export const error = writable(/** @type {string | null} */ (null));

// Each user's trips live in their own subcollection: users/{uid}/trips.
function tripsCol(uid) {
  return collection(db, "users", uid, "trips");
}

let unsub = null;
let slowTimer = null;

// Re-subscribe whenever the signed-in user changes.
user.subscribe((u) => {
  if (unsub) {
    unsub();
    unsub = null;
  }
  clearTimeout(slowTimer);
  events.set([]);
  error.set(null);

  if (!u) {
    // Signed out (or auth state still unknown): nothing to load.
    loading.set(false);
    return;
  }

  loading.set(true);
  let connected = false;
  // Firestore's WebChannel retries silently when it can't reach the backend,
  // which would leave the UI hanging. Surface a hint if nothing arrives.
  slowTimer = setTimeout(() => {
    if (!connected) {
      error.set(
        "Can't reach Firestore. Make sure Cloud Firestore is enabled for the " +
          "'ooo-friend' project and that the rules in firestore.rules are published."
      );
      loading.set(false);
    }
  }, 6000);

  unsub = onSnapshot(
    tripsCol(u.uid),
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
});

function requireUid() {
  const u = get(user);
  if (!u) throw new Error("You must be signed in.");
  return u.uid;
}

export function addEvent({ person, start, end }) {
  return addDoc(tripsCol(requireUid()), { person, start, end });
}

export function updateEvent(id, { person, start, end }) {
  return updateDoc(doc(db, "users", requireUid(), "trips", id), {
    person,
    start,
    end,
  });
}

export function deleteEvent(id) {
  return deleteDoc(doc(db, "users", requireUid(), "trips", id));
}
