import { timingSafeEqual } from "node:crypto";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore as getWebFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { NextResponse, type NextRequest } from "next/server";

import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FailureCategory =
  | "unauthorized"
  | "forbidden"
  | "method_not_allowed"
  | "missing_healthcheck_token"
  | "missing_required_variable"
  | "invalid_demo_mode"
  | "project_id_mismatch"
  | "firebase_web_initialization"
  | "firebase_admin_initialization"
  | "firestore_access"
  | "authentication_access";

const expectedProjectId = "hotelcasablanca-ce1b5";
const requiredVariables = [
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

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function failed(category: FailureCategory, status = 500, variable?: string) {
  return json(variable ? { status: "failed", category, variable } : { status: "failed", category }, status);
}

function envValue(name: string) {
  return process.env[name]?.trim();
}

function isAuthorized(request: NextRequest) {
  const token = envValue("INTERNAL_HEALTHCHECK_TOKEN");
  if (!token) return "missing" as const;

  const authorization = request.headers.get("authorization") ?? "";
  const provided = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!provided) return "absent" as const;

  const expectedBuffer = Buffer.from(token);
  const providedBuffer = Buffer.from(provided);
  if (expectedBuffer.length !== providedBuffer.length) return "invalid" as const;
  return timingSafeEqual(expectedBuffer, providedBuffer) ? "valid" as const : "invalid" as const;
}

function verifyRequiredVariables() {
  for (const name of requiredVariables) {
    if (!envValue(name)) return name;
  }
  return null;
}

function verifyWebConfig() {
  const appName = "firebase-health-web";
  const app = getApps().some((item) => item.name === appName)
    ? getApp(appName)
    : initializeApp({
        apiKey: envValue("NEXT_PUBLIC_FIREBASE_API_KEY"),
        authDomain: envValue("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
        projectId: envValue("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
        storageBucket: envValue("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
        messagingSenderId: envValue("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
        appId: envValue("NEXT_PUBLIC_FIREBASE_APP_ID"),
      }, appName);

  getAuth(app);
  getWebFirestore(app);
  getStorage(app);
}

export async function GET(request: NextRequest) {
  const authorization = isAuthorized(request);
  if (authorization === "missing") return failed("missing_healthcheck_token", 503);
  if (authorization === "absent") return failed("unauthorized", 401);
  if (authorization === "invalid") return failed("forbidden", 403);

  const missing = verifyRequiredVariables();
  if (missing) return failed("missing_required_variable", 500, missing);
  if (envValue("DEMO_MODE") !== "false") return failed("invalid_demo_mode", 500, "DEMO_MODE");
  if (envValue("NEXT_PUBLIC_FIREBASE_PROJECT_ID") !== expectedProjectId || envValue("FIREBASE_PROJECT_ID") !== expectedProjectId) {
    return failed("project_id_mismatch", 500);
  }

  try {
    verifyWebConfig();
  } catch {
    return failed("firebase_web_initialization", 500);
  }

  let db;
  try {
    db = getAdminDb();
  } catch {
    return failed("firebase_admin_initialization", 500);
  }

  try {
    await db.collection("rooms").limit(1).get();
  } catch {
    return failed("firestore_access", 500);
  }

  try {
    await getAdminAuth().listUsers(1);
  } catch {
    return failed("authentication_access", 500);
  }

  return json({
    environment: "production",
    requiredVariables: true,
    demoModeDisabled: true,
    projectIdMatches: true,
    firebaseAdmin: "functional",
    firestore: "accessible",
    authentication: "accessible",
    firebaseWebConfig: "present",
  });
}

export function POST() {
  return failed("method_not_allowed", 405);
}

export function PUT() {
  return failed("method_not_allowed", 405);
}

export function PATCH() {
  return failed("method_not_allowed", 405);
}

export function DELETE() {
  return failed("method_not_allowed", 405);
}