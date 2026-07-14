import { readFileSync } from "node:fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { loadEnvConfig } from "@next/env";

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
  if (!expectedProjectId) throw new Error("No se encontró projectId en .firebaserc.");
  if (!projectId) throw new Error("Falta FIREBASE_PROJECT_ID.");
  if (projectId !== expectedProjectId || projectId !== "hotelcasablanca-ce1b5") {
    throw new Error("El Project ID configurado no corresponde a Hotel Casa Blanca.");
  }
  return projectId;
}

function getCredential() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail) throw new Error("Falta FIREBASE_CLIENT_EMAIL.");
  if (!privateKey) throw new Error("Falta FIREBASE_PRIVATE_KEY.");
  return cert({ projectId: assertHotelCasaBlancaProject(), clientEmail, privateKey });
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