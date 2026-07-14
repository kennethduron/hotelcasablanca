import { cert, getApps as getAdminApps, initializeApp as initializeAdminApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore as getWebFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const expectedProjectId = "hotelcasablanca-ce1b5";
const required = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "DEMO_MODE",
] as const;

let failed = false;

function line(message: string) {
  process.stdout.write(`${message}\n`);
}

function envValue(name: string) {
  return process.env[name]?.trim();
}

for (const name of required) {
  const current = envValue(name);
  if (!current) {
    line(`${name}: ${current === "" ? "VACÍA" : "AUSENTE"}`);
    failed = true;
  } else if (name === "DEMO_MODE") {
    line("DEMO_MODE: false");
  } else {
    line(`${name}: PRESENTE`);
  }
}

if (envValue("DEMO_MODE") !== "false") {
  line("DEMO_MODE: INVÁLIDA");
  failed = true;
}

if (process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY || process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL) {
  line("Variables privadas: INVÁLIDA");
  failed = true;
} else {
  line("Variables privadas: PRESENTE");
}

if (envValue("NEXT_PUBLIC_FIREBASE_PROJECT_ID") === expectedProjectId && envValue("FIREBASE_PROJECT_ID") === expectedProjectId) {
  line("Project ID: COINCIDE");
} else {
  line("Project ID: INVÁLIDA");
  failed = true;
}

try {
  const app = getApps().length ? getApp() : initializeApp({
    apiKey: envValue("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: envValue("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: envValue("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: envValue("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: envValue("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: envValue("NEXT_PUBLIC_FIREBASE_APP_ID"),
  });
  getAuth(app);
  getWebFirestore(app);
  getStorage(app);
  line("Firebase Web: FUNCIONAL");
} catch {
  line("Firebase Web: INVÁLIDA");
  failed = true;
}

try {
  const adminApp = getAdminApps().length ? getAdminApps()[0]! : initializeAdminApp({
    credential: cert({
      projectId: envValue("FIREBASE_PROJECT_ID"),
      clientEmail: envValue("FIREBASE_CLIENT_EMAIL"),
      privateKey: envValue("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n"),
    }),
    projectId: envValue("FIREBASE_PROJECT_ID"),
    storageBucket: envValue("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  });
  const db = getFirestore(adminApp);
  await db.listCollections();
  line("Firestore: ACCESIBLE");
  await getAdminAuth(adminApp).listUsers(1);
  line("Authentication: ACCESIBLE");
  line("Firebase Admin: FUNCIONAL");
} catch {
  line("Firebase Admin: INVÁLIDA");
  failed = true;
}

if (failed) process.exit(1);