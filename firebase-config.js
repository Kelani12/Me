// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_ww_y4JugNrNUwcfNmDVi7rcVXtMOk0c",
  authDomain: "menacare-b2fba.firebaseapp.com",
  projectId: "menacare-b2fba",
  storageBucket: "menacare-b2fba.firebasestorage.app",
  messagingSenderId: "230822743231",
  appId: "1:230822743231:web:cb07afa9b43144f9ffca0a",
  measurementId: "G-G1GG58J57F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);