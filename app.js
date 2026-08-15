import { app } from "./firebase-config.js";

const statusEl = document.getElementById("status");

if (app && app.options && app.options.projectId) {
  statusEl.textContent = `Firebase connected to project: ${app.options.projectId}`;
} else {
  statusEl.textContent = "Firebase config is still using placeholder values.";
}
