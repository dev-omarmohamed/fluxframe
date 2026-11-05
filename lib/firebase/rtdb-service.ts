import { adminRtdb } from "./admin";

const RTDB_URL =
  process.env.FIREBASE_DATABASE_URL ||
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  "https://fluxframe-f4103-default-rtdb.firebaseio.com";

export async function saveCustomerRequestToRTDB(id: string, data: Record<string, any>) {
  const hasServiceAccountKey = Boolean(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);

  // If service account credentials are fully configured, use Admin SDK
  if (hasServiceAccountKey) {
    try {
      await adminRtdb.ref(`requests/${id}`).set({
        ...data,
        id,
        timestamp: Date.now(),
      });
      return { success: true, method: "admin-sdk" };
    } catch (err: any) {
      console.warn("adminRtdb error, falling back to REST API:", err.message);
    }
  }

  // Fast direct REST API write to Firebase Realtime Database
  try {
    const res = await fetch(`${RTDB_URL}/requests/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        id,
        timestamp: Date.now(),
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      return { success: true, method: "rest-api" };
    }
  } catch (restErr: any) {
    console.warn("RTDB REST API write warning:", restErr.message);
  }

  return { success: false };
}
