export interface FirestoreUser {
  uid: string;
  name: string;
  photoURL: string | null;
}

export interface ConnectedFirestoreUser extends FirestoreUser {
  connected: boolean;
}
