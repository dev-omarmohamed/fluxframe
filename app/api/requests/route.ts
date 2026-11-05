import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { saveCustomerRequestToRTDB } from "@/lib/firebase/rtdb-service";

const requestSchema = z.object({
  templateId: z.string().optional().default("full-identity-pack"),
  type: z.enum(["AI_TEMPLATE", "AI_CONTENT", "PRINT_3D"]).optional().default("AI_TEMPLATE"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Valid phone number is required"),
  details: z.string().optional().default(""),
  priceEGP: z.number().optional().default(1000),
  packageName: z.string().optional(),
  hp_trap: z.string().optional().default(""),
  userMathAnswer: z.number().optional(),
  expectedMathAnswer: z.number().optional(),
});

// In-memory sliding window cache to prevent spam/double-submission within 5 seconds for same phone
const recentSubmissions = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const {
      templateId,
      type,
      name,
      phone,
      details,
      priceEGP,
      packageName,
      hp_trap,
      userMathAnswer,
      expectedMathAnswer,
    } = parsed.data;

    // 1. Bot Honeypot Check
    if (hp_trap && hp_trap.trim() !== "") {
      return NextResponse.json(
        { error: "Security validation failed. Automated submissions are blocked." },
        { status: 400 }
      );
    }

    // 2. Human Verification Math Check
    if (
      typeof expectedMathAnswer === "number" &&
      typeof userMathAnswer === "number" &&
      userMathAnswer !== expectedMathAnswer
    ) {
      return NextResponse.json(
        { error: "Incorrect verification math answer. Please try again." },
        { status: 400 }
      );
    }

    // 3. Double-submission prevention (per phone number within 4 seconds)
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const lastSubTime = recentSubmissions.get(cleanPhone);
    const now = Date.now();
    if (lastSubTime && now - lastSubTime < 4000) {
      return NextResponse.json(
        {
          error: "Duplicate request detected. Please wait a few seconds before submitting again.",
        },
        { status: 429 }
      );
    }
    recentSubmissions.set(cleanPhone, now);

    // Clean up cache periodically
    if (recentSubmissions.size > 200) {
      recentSubmissions.forEach((time, key) => {
        if (now - time > 60000) {
          recentSubmissions.delete(key);
        }
      });
    }

    const newRequest = {
      type: type || "AI_TEMPLATE",
      status: "NEW",
      templateId: templateId || "full-identity-pack",
      packageName: packageName || null,
      name,
      phone,
      details: details || "",
      address: null,
      fileName: null,
      fileUrl: null,
      printingCostEGP: null,
      deliveryFeeEGP: 0,
      totalEGP: priceEGP || 1000,
      adminNotes: null,
      createdAtIso: new Date().toISOString(),
    };

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Authoritative Single write to Firebase Realtime Database
    await saveCustomerRequestToRTDB(requestId, {
      ...newRequest,
      id: requestId,
    });

    // Write to Firestore if service account configured
    const hasServiceAccountKey = Boolean(
      process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL
    );
    if (hasServiceAccountKey) {
      try {
        await adminDb.collection("requests").doc(requestId).set({
          ...newRequest,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } catch (fsErr: any) {
        console.warn("Firestore write fallback:", fsErr.message);
      }
    }

    return NextResponse.json(
      {
        success: true,
        id: requestId,
        message: "Request received successfully in Realtime Database.",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating request:", err);
    return NextResponse.json(
      { error: "Failed to process request: " + err.message },
      { status: 500 }
    );
  }
}
