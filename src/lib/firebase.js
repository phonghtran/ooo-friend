import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_VjXYmZq88wPBZKT9gLjkiL4ZoLwvNic",
  authDomain: "ooo-friend.firebaseapp.com",
  projectId: "ooo-friend",
  storageBucket: "ooo-friend.firebasestorage.app",
  messagingSenderId: "547668481783",
  appId: "1:547668481783:web:c955edeaccd6d503f025f2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
