import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB_ww_y4JugNrNUwcfNmDVi7rcVXtMOk0c",
  authDomain: "menacare-b2fba.firebaseapp.com",
  databaseURL: "https://menacare-b2fba-default-rtdb.firebaseio.com",
  projectId: "menacare-b2fba",
  storageBucket: "menacare-b2fba.firebasestorage.app",
  messagingSenderId: "230822743231",
  appId: "1:230822743231:web:cb07afa9b43144f9ffca0a",
  measurementId: "G-G1GG58J57F"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);