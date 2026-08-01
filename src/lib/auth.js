import { writable } from "svelte/store";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase.js";

// `undefined` = still figuring out the session, `null` = signed out,
// object = signed-in user.
export const user = writable(undefined);
export const authReady = writable(false);

onAuthStateChanged(auth, (u) => {
  user.set(u ?? null);
  authReady.set(true);
});

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

// Turn Firebase's error codes into something a person can read.
export function authErrorMessage(err) {
  const code = err?.code ?? "";
  switch (code) {
    case "auth/invalid-email":
      return "That doesn't look like a valid email.";
    case "auth/missing-password":
      return "Enter a password.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/email-already-in-use":
      return "An account already exists for that email. Try signing in.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Wrong email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a bit and try again.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in isn't enabled for this project yet.";
    case "auth/configuration-not-found":
      return "Auth isn't set up yet. Enable Email/Password in the Firebase console.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return err?.message ?? "Something went wrong.";
  }
}
