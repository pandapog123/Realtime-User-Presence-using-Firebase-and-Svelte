import {
  get,
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  set,
} from "firebase/database";
import { firebaseApp } from ".";
import { get as getStore } from "svelte/store";
import { userStore } from "./auth";

export const database = getDatabase(firebaseApp);

const connectionRef = ref(database, ".info/connected");

onValue(connectionRef, async (snapshot) => {
  let connected = snapshot.val();

  if (typeof connected !== "boolean") {
    return;
  }

  let userData = getStore(userStore);

  if (!userData) {
    return;
  }

  setPresence(userData.uid, connected);

  const userConnectedRef = ref(database, `connections/${userData.uid}`);

  onDisconnect(userConnectedRef).set(false);
});

export async function setPresence(uid: string, connected: boolean) {
  const userConnectedRef = ref(database, `connections/${uid}`);

  set(userConnectedRef, connected);
}

export async function getConnectivity(uid: string) {
  const userRef = ref(database, `connections/${uid}`);

  const connectionSnapshot = await get(userRef);

  if (!connectionSnapshot.exists()) {
    return "Connection Data not found";
  }

  const connectionData = connectionSnapshot.val();

  if (typeof connectionData !== "boolean") {
    return "Connection Data invalid";
  }

  return connectionData;
}
