import { app, db } from "./firebase-config.js";
import { addDoc, collection } from "firebase/firestore";

const statusEl = document.getElementById("status");
const button = document.getElementById("saveTest");

if (app && app.options && app.options.projectId) {
  statusEl.textContent = `Firebase connected to project: ${app.options.projectId}`;
} else {
  statusEl.textContent = "Firebase config is still using placeholder values.";
}

button.addEventListener("click", async () => {
  try {
    const docRef = await addDoc(collection(db, "testCollection"), {
      message: "MenaCare Firestore connected",
      createdAt: new Date().toISOString(),
    });

    statusEl.textContent = `Firestore connected. Test document added with ID: ${docRef.id}`;
  } catch (error) {
    statusEl.textContent = `Firestore connection failed: ${error.message}`;
  }
});
