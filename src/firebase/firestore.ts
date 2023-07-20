import type { User } from "firebase/auth";
import {
  CollectionReference,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  type DocumentData,
  query,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { firebaseApp } from ".";
import type {
  ConnectedFirestoreUser,
  FirestoreUser,
} from "../types/firestore_user";
import { writable } from "svelte/store";
import { get as getStore } from "svelte/store";
import { getConnectivity, setPresence } from "./database";

export const firestore = getFirestore(firebaseApp);

const usersCollection = collection(
  firestore,
  "users"
) as CollectionReference<FirestoreUser>;

export const firestoreUserStore = writable<FirestoreUser | null>();

export async function handleUserChanges(user: User | null) {
  if (!user) {
    return;
  }

  const firestoreUserData = await getFirestoreUser(user.uid);

  setPresence(user.uid, true);

  if (firestoreUserData) {
    firestoreUserStore.set(firestoreUserData);

    return;
  }

  const userDocRef = doc(usersCollection, user.uid);

  const currentFirestoreUserStore: FirestoreUser = {
    uid: user.uid,
    name: user.displayName || "User " + user.uid,
    photoURL: user.photoURL,
  };

  await setDoc<FirestoreUser, DocumentData>(
    userDocRef,
    currentFirestoreUserStore
  );

  firestoreUserStore.set(currentFirestoreUserStore);
}

export async function getFirestoreUser(uid: string) {
  const userDocRef = doc(usersCollection, uid);

  const userSnapshot = await getDoc(userDocRef);

  const userData = userSnapshot.data();

  if (!userData) {
    return null;
  }

  return userData;
}

export const usersArrayStore = writable<ConnectedFirestoreUser[]>([], (set) => {
  const usersQuery = query(usersCollection, limit(20));

  onSnapshot(usersQuery, async (snapshot) => {
    let users: ConnectedFirestoreUser[] = [];

    for (const docSnapshot of snapshot.docs) {
      let docData = docSnapshot.data();

      let connected = await getConnectivity(docData.uid);

      if (typeof connected === "boolean") {
        users.push({
          ...docData,
          connected,
        });
      }

      set(users);
    }
  });
});
