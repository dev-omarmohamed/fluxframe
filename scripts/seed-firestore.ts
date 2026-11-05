import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import { AUTHORIZED_ADMIN_EMAILS } from "../lib/auth-config";
import fs from "fs";
import path from "path";

const rtdbUrl =
  process.env.FIREBASE_DATABASE_URL ||
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  "https://fluxframe-f4103-default-rtdb.firebaseio.com";

function initAdmin() {
  if (getApps().length > 0) return getApps()[0];

  const keyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
  if (fs.existsSync(keyPath)) {
    const keyFile = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
    return initializeApp({
      credential: cert(keyFile),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${keyFile.project_id}.firebasestorage.app`,
      databaseURL: rtdbUrl,
    });
  }

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

  return initializeApp({
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
    databaseURL: rtdbUrl,
  });
}

async function main() {
  console.log("==========================================");
  console.log("FluxFrame — Seed & 2 Admin Setup");
  console.log("==========================================");

  const app = initAdmin();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const rtdb = getDatabase(app);

  for (const adminEmail of AUTHORIZED_ADMIN_EMAILS) {
    const adminPassword = adminEmail; // Password same as email
    console.log(`\nProcessing admin: ${adminEmail}`);

    let adminUid = "";
    try {
      const existing = await auth.getUserByEmail(adminEmail);
      adminUid = existing.uid;
      console.log(`Found existing user with UID: ${adminUid}`);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        const created = await auth.createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: adminEmail.split("@")[0],
        });
        adminUid = created.uid;
        console.log(`Created new Admin user with UID: ${adminUid}`);
      } else {
        console.warn(`Auth check notice: ${err.message}`);
      }
    }

    if (adminUid) {
      try {
        await auth.setCustomUserClaims(adminUid, { admin: true });
        console.log(`Assigned custom claim { admin: true } to UID: ${adminUid}`);
      } catch (cErr: any) {
        console.warn(`Could not set custom claim (service account key required): ${cErr.message}`);
      }

      try {
        await db.collection("admins").doc(adminUid).set(
          {
            email: adminEmail,
            uid: adminUid,
            role: "admin",
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      } catch (dbErr: any) {
        // Firestore fallback
      }

      try {
        await rtdb.ref(`admins/${adminUid}`).set({
          uid: adminUid,
          email: adminEmail,
          role: "admin",
          updatedAt: Date.now(),
        });
      } catch (rtdbErr: any) {
        // RTDB fallback
      }
    }
  }

  // Seed sample template
  const templateSlug = "ai-powered-full-brand-identity";
  const templateData = {
    slug: templateSlug,
    title: "الهوية البصرية المتكاملة للمشاريع وملفات الشعار والموك آبس",
    description:
      "كل ما تحتاجه لإطلاق علامتك التجارية من الصفر: ملفات الشعار المصدرية بجميع الصيغ (Vector SVG, PNG شفاف, PDF عالي الجودة) مع موك آبس واقعية شاملة ودليل استخدام متكامل.",
    priceEGP: 1000,
    coverImage: "/uploads/brand-cover.svg",
    profileImage: "/uploads/brand-profile.svg",
    promptSnippet:
      "Generate a complete startup brand identity system. Vector SVG logos, transparent PNGs, print-ready PDF, photorealistic mockups (packaging, stationery, apparel) and brand guidelines.",
    fullPrompt:
      "Generate a complete brand identity based on the provided core application icon. Use this single icon as the foundation for the entire design. Do not create different logos. Your task is to apply this core icon consistently across all brand assets to create a cohesive visual identity. Generate the following assets: Vector SVG logos, high-resolution transparent PNG, print-ready PDF, Business cards (front and back), letterheads, envelopes, packaging mockups, apparel mockups, social media profile and cover images, email signature templates, banners (web and print), and a comprehensive brand style guide page showing the color palette, typography, and icon usage rules.",
    isActive: true,
  };

  try {
    await db.collection("templates").doc(templateSlug).set(templateData, { merge: true });
    console.log(`Seeded template document: templates/${templateSlug}`);
  } catch (tErr) {}

  console.log("\n==========================================");
  console.log("AUTHORIZED ADMIN ACCOUNTS:");
  AUTHORIZED_ADMIN_EMAILS.forEach((email, i) => {
    console.log(`${i + 1}. ${email}`);
    console.log(`   Password: ${email}`);
  });
  console.log("==========================================");
}

main().catch((err) => {
  console.error("Seed script notice:", err);
});
