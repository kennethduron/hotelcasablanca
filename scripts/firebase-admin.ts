import { readFileSync } from "node:fs";
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

function readExpectedProjectId() {
  const firebaseConfig = JSON.parse(readFileSync(".firebaserc", "utf8")) as {
    projects?: { default?: string };
  };
  return firebaseConfig.projects?.default;
}

export function assertHotelCasaBlancaProject() {
  const expectedProjectId = readExpectedProjectId();
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!expectedProjectId) throw new Error("No se encontro projectId en .firebaserc.");
  if (!projectId) throw new Error("Falta FIREBASE_PROJECT_ID.");
  if (projectId !== expectedProjectId || projectId !== "hotelcasablanca-ce1b5") {
    throw new Error("El Project ID configurado no corresponde a Hotel Casa Blanca.");
  }
  return projectId;
}

function getCredential() {
  const projectId = assertHotelCasaBlancaProject();
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return applicationDefault();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (clientEmail && privateKey) return cert({ projectId, clientEmail, privateKey });
  throw new Error("Falta configuracion de credenciales de Firebase Admin.");
}

function getAdminApp() {
  if (getApps().length) return getApps()[0]!;
  return initializeApp({
    credential: getCredential(),
    projectId: assertHotelCasaBlancaProject(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export function getScriptAuth() {
  return getAuth(getAdminApp());
}

export function getScriptDb() {
  return getFirestore(getAdminApp());
}
