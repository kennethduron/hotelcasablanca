import "server-only";

import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

export function hasFirebaseAdminConfig() {
  return Boolean(process.env.FIREBASE_PROJECT_ID && ((process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) || process.env.GOOGLE_APPLICATION_CREDENTIALS));
}

function getAdminApp() {
  if (getApps().length) return getApps()[0]!;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("FIREBASE_PROJECT_ID no está configurado.");
  const credential = process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
    ? cert({ projectId, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") })
    : applicationDefault();
  return initializeApp({ credential, projectId, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET });
}

export function getAdminAuth() { return getAuth(getAdminApp()); }
export function getAdminDb() { return getFirestore(getAdminApp()); }
export function getAdminStorage() { return getStorage(getAdminApp()); }
