import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

function initAdmin() {
  if (getApps().length > 0) return getApps()[0];

  const keyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
  if (fs.existsSync(keyPath)) {
    const keyFile = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
    return initializeApp({
      credential: cert(keyFile),
    });
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
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
    });
  }

  throw new Error(
    "Missing Firebase credentials in .env.local or serviceAccountKey.json"
  );
}

async function main() {
  const uid = process.argv[2] || process.env.TARGET_UID;

  if (!uid) {
    console.error("Usage: npx tsx scripts/set-admin-claim.ts <UID>");
    process.exit(1);
  }

  const app = initAdmin();
  const auth = getAuth(app);

  console.log(`Setting custom claim { admin: true } for user UID: ${uid}...`);
  await auth.setCustomUserClaims(uid, { admin: true });
  console.log(`Successfully verified and granted admin claim to UID: ${uid}`);
}

main().catch((err) => {
  console.error("Error setting admin claim:", err);
  process.exit(1);
});

