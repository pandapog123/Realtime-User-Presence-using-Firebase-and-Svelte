// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgv_xucm5PFziAq51KuGf6JJ_3OEjKfcE",
  authDomain: "user-presence-with-svelte.firebaseapp.com",
  projectId: "user-presence-with-svelte",
  storageBucket: "user-presence-with-svelte.appspot.com",
  messagingSenderId: "672842759348",
  appId: "1:672842759348:web:171435e53042b4dcdfabe1",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
