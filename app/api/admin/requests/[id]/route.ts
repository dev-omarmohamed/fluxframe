import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdminToken } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const RTDB_URL =
  process.env.FIREBASE_DATABASE_URL ||
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  "https://fluxframe-f4103-default-rtdb.firebaseio.com";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await verifyAdminToken(req);
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { status, printingCostEGP, deliveryFeeEGP, adminNotes } = body;

    const deliveryFee = typeof deliveryFeeEGP === "number" ? deliveryFeeEGP : 150;
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (status !== undefined) {
      updates.status = status;
    }

    if (adminNotes !== undefined) {
      updates.adminNotes = adminNotes;
    }

    updates.deliveryFeeEGP = deliveryFee;

    if (printingCostEGP !== undefined) {
      if (printingCostEGP === null || printingCostEGP === "") {
        updates.printingCostEGP = null;
        updates.totalEGP = null;
      } else {
        const costNum = Number(printingCostEGP);
        if (!isNaN(costNum)) {
          updates.printingCostEGP = costNum;
          updates.totalEGP = costNum + deliveryFee;
        }
      }
    }

    // 1. Update in Realtime Database via REST API
    try {
      await fetch(`${RTDB_URL}/requests/${id}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        signal: AbortSignal.timeout(3000),
      });
    } catch (rtdbErr: any) {
      console.warn("RTDB patch warning:", rtdbErr.message);
    }

    // 2. Also update in Firestore if service account key is available
    const hasServiceAccountKey = Boolean(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);
    if (hasServiceAccountKey) {
      try {
        const docRef = adminDb.collection("requests").doc(id);
        const existing = await docRef.get();
        if (existing.exists) {
          await docRef.update({
            ...updates,
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
      } catch (fsErr: any) {
        console.warn("Firestore patch notice:", fsErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id,
        ...updates,
      },
    });
  } catch (err: any) {
    console.error("Error updating request:", err);
    return NextResponse.json(
      { error: "Failed to update request: " + err.message },
      { status: 500 }
    );
  }
}
