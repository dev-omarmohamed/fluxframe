import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";
import { getDatabase, Database } from "firebase-admin/database";
import { isAuthorizedAdmin, AUTHORIZED_ADMIN_EMAILS } from "@/lib/auth-config";
import fs from "fs";
import path from "path";

const rtdbUrl =
  process.env.FIREBASE_DATABASE_URL ||
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  "https://fluxframe-f4103-default-rtdb.firebaseio.com";

const apiKey =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "AIzaSyATwZ-pOpxbi9cTxn8QxhBbAfQTMwxd0pI";

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Check for serviceAccountKey.json file first
  const keyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
  if (fs.existsSync(keyPath)) {
    try {
      const keyFile = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
      return initializeApp({
        credential: cert(keyFile),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${keyFile.project_id}.firebasestorage.app`,
        databaseURL: rtdbUrl,
      });
    } catch (e) {
      console.warn("Failed reading serviceAccountKey.json, trying environment variables...");
    }
  }

  // Check environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "fluxframe-f4103";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
      databaseURL: rtdbUrl,
    });
  }

  // Safe fallback for local build / preview when credentials not yet configured
  return initializeApp({
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
    databaseURL: rtdbUrl,
  });
}

const adminApp = getAdminApp();
const adminAuth: Auth = getAuth(adminApp);
const adminDb: Firestore = getFirestore(adminApp);
const adminStorage: Storage = getStorage(adminApp);
const adminRtdb: Database = getDatabase(adminApp);

export async function verifyAdminToken(req: Request) {
  const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Missing or invalid authorization header", status: 401 };
  }

  const token = authHeader.split(" ")[1];
  let verifiedEmail: string | undefined;
  let verifiedUid: string | undefined;

  // 1. Try Admin SDK if service account is fully configured
  const hasServiceAccountKey = Boolean(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);
  if (hasServiceAccountKey) {
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      verifiedEmail = decoded.email;
      verifiedUid = decoded.uid;
    } catch (adminErr: any) {
      console.warn("Admin SDK token verification fallback:", adminErr.message);
    }
  }

  // 2. Fallback: Verify ID token securely via Google Identity Toolkit API
  if (!verifiedEmail) {
    try {
      const lookupRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
          signal: AbortSignal.timeout(5000),
        }
      );

      const lookupData = await lookupRes.json();
      if (lookupRes.ok && lookupData.users && lookupData.users.length > 0) {
        verifiedEmail = lookupData.users[0].email;
        verifiedUid = lookupData.users[0].localId;
      } else {
        return {
          error: "Invalid token or expired session: " + (lookupData?.error?.message || "Verification failed"),
          status: 403,
        };
      }
    } catch (lookupErr: any) {
      return {
        error: "Failed to verify token: " + lookupErr.message,
        status: 403,
      };
    }
  }

  // 3. STRICT AUTHORIZATION GATE: ONLY the 2 specified admin emails are authorized!
  if (!isAuthorizedAdmin(verifiedEmail)) {
    return {
      error: `Access denied. Only authorized administrators (${AUTHORIZED_ADMIN_EMAILS.join(", ")}) are permitted to sign in.`,
      status: 403,
    };
  }

  return {
    user: {
      uid: verifiedUid || "",
      email: verifiedEmail || "",
      admin: true,
    },
  };
}

export { adminApp, adminAuth, adminDb, adminStorage, adminRtdb };
