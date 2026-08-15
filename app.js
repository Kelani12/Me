import { app, database } from "./firebase-config.js";
import { ref, push, set } from "firebase/database";

const statusEl = document.getElementById("status");
const button = document.getElementById("saveTest");

if (app && app.options && app.options.projectId) {
  statusEl.textContent = `Firebase connected to project: ${app.options.projectId}`;
} else {
  statusEl.textContent = "Firebase config is still using placeholder values.";
}

button.addEventListener("click", async () => {
  try {
    const testRef = ref(database, "testConnection");
    const newItem = push(testRef);

    await set(newItem, {
      message: "MenaCare Realtime Database connected",
      createdAt: new Date().toISOString(),
    });

    statusEl.textContent = `Realtime Database connected. Test item written to: ${newItem.key}`;
  } catch (error) {
    statusEl.textContent = `Realtime Database connection failed: ${error.message}`;
  }
});
