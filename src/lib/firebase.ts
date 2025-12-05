// src/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";
// 🔹 Configuración de Firebase (usa variables de entorno en Vite con import.meta.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 🔹 Singleton: si ya hay una app inicializada, la reutiliza
const appConfigFirebase = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
export let messaging: Messaging | null = null;
try {
  const supported = await isSupported();
  if (supported) {
    messaging = getMessaging(appConfigFirebase);
  }
} catch {
  messaging = null;
}
// 🔹 Exporta servicios que necesites
export const auth = getAuth(appConfigFirebase);
export const db = getFirestore(appConfigFirebase);
export const storage = getStorage(appConfigFirebase);
export default appConfigFirebase;