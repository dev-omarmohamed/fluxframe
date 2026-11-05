import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyATwZ-pOpxbi9cTxn8QxhBbAfQTMwxd0pI";
const RTDB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://fluxframe-f4103-default-rtdb.firebaseio.com";

const adminAccounts = [
  {
    email: "omarmohamedflux8824@gmail.com",
    password: "omarmohamedflux8824@gmail.com",
  },
  {
    email: "mohamedheshamflux8824@gmail.com",
    password: "mohamedheshamflux8824@gmail.com",
  },
];

async function createOrVerifyUser(account: { email: string; password: string }) {
  console.log(`\n-----------------------------------------`);
  console.log(`Processing: ${account.email}`);

  // 1. Try to sign up (create account in Firebase Auth)
  const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  const signUpRes = await fetch(signUpUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: account.email,
      password: account.password,
      returnSecureToken: true,
    }),
  });

  const signUpData = await signUpRes.json();

  let uid = "";
  let idToken = "";

  if (signUpRes.ok) {
    uid = signUpData.localId;
    idToken = signUpData.idToken;
    console.log(`✅ Successfully created account in Firebase Auth!`);
    console.log(`   UID: ${uid}`);
  } else {
    const errorMsg = signUpData?.error?.message;
    if (errorMsg === "EMAIL_EXISTS") {
      console.log(`ℹ️ Account already exists in Firebase Auth. Verifying sign-in...`);
      // Sign in to verify and get UID
      const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
      const signInRes = await fetch(signInUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: account.email,
          password: account.password,
          returnSecureToken: true,
        }),
      });
      const signInData = await signInRes.json();
      if (signInRes.ok) {
        uid = signInData.localId;
        idToken = signInData.idToken;
        console.log(`✅ Sign-in verified successfully!`);
        console.log(`   UID: ${uid}`);
      } else {
        console.error(`❌ Failed to sign in with specified password: ${signInData?.error?.message}`);
        return null;
      }
    } else {
      console.error(`❌ Error creating user: ${errorMsg}`);
      return null;
    }
  }

  // 2. Register admin identity in Realtime Database under /admins
  if (uid) {
    try {
      const sanitizedKey = uid.replace(/[^a-zA-Z0-9_-]/g, "_");
      const rtdbRes = await fetch(`${RTDB_URL}/admins/${sanitizedKey}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          email: account.email,
          role: "admin",
          authorizedAt: new Date().toISOString(),
        }),
      });
      if (rtdbRes.ok) {
        console.log(`✅ Registered admin role in Realtime Database: /admins/${sanitizedKey}`);
      }
    } catch (rtdbErr: any) {
      console.warn(`Warning recording in RTDB: ${rtdbErr.message}`);
    }
  }

  return { email: account.email, uid, idToken };
}

async function main() {
  console.log("==========================================");
  console.log("FluxFrame — Registering 2 Admin Accounts");
  console.log("==========================================");

  const results = [];
  for (const acc of adminAccounts) {
    const res = await createOrVerifyUser(acc);
    if (res) results.push(res);
  }

  console.log("\n==========================================");
  console.log("SUMMARY OF ADMIN ACCOUNTS REGISTERED:");
  results.forEach((r, idx) => {
    console.log(`${idx + 1}. ${r.email} (UID: ${r.uid})`);
  });
  console.log("==========================================");
}

main().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});

