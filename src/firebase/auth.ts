import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseApp } from ".";
import { get, writable } from "svelte/store";
import { handleUserChanges } from "./firestore";
import { setPresence } from "./database";

export const auth = getAuth(firebaseApp);

export const userStore = writable<User | null>();

auth.onAuthStateChanged(async (auth) => {
  userStore.set(auth);

  handleUserChanges(auth);
});

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider);
}

export async function signOutAsync() {
  let userData = get(userStore);

  if (!userData) {
    return;
  }

  await signOut(auth);

  await setPresence(userData.uid, false);
}
