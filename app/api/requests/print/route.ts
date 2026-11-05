import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { saveCustomerRequestToRTDB } from "@/lib/firebase/rtdb-service";

const allowedExtensions = [
  ".stl",
  ".obj",
  ".3mf",
  ".step",
  ".stp",
  ".pdf",
  ".zip",
  ".png",
  ".jpg",
  ".jpeg",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const recentPrintSubmissions = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = (formData.get("name") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const address = (formData.get("address") as string)?.trim();
    const details = (formData.get("details") as string)?.trim() || "";
    const file = formData.get("file") as File | null;
    const hpTrap = (formData.get("hp_trap") as string)?.trim() || "";
    const userMathAnswer = Number(formData.get("userMathAnswer"));
    const expectedMathAnswer = Number(formData.get("expectedMathAnswer"));

    // 1. Bot Honeypot
    if (hpTrap !== "") {
      return NextResponse.json(
        { error: "Security validation failed. Automated submissions are blocked." },
        { status: 400 }
      );
    }

    // 2. Human Verification Math Check
    if (
      !isNaN(expectedMathAnswer) &&
      !isNaN(userMathAnswer) &&
      userMathAnswer !== expectedMathAnswer
    ) {
      return NextResponse.json(
        { error: "Incorrect verification math answer. Please try again." },
        { status: 400 }
      );
    }

    // 3. Double-click debounce guard
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      const now = Date.now();
      const last = recentPrintSubmissions.get(cleanPhone);
      if (last && now - last < 4000) {
        return NextResponse.json(
          { error: "Duplicate request detected. Please wait a few seconds before submitting again." },
          { status: 429 }
        );
      }
      recentPrintSubmissions.set(cleanPhone, now);
    }

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }
    if (!phone || phone.length < 8) {
      return NextResponse.json({ error: "Valid phone number is required" }, { status: 400 });
    }
    if (!address || address.length < 3) {
      return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
    }
    if (!file) {
      return NextResponse.json({ error: "3D model or specification file is required" }, { status: 400 });
    }

    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: `File extension ${ext} not allowed. Supported: ${allowedExtensions.join(", ")}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 25 MB size limit" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `requests/prints/${Date.now()}_${sanitizedFileName}`;
    let fileUrl = "";

    try {
      const bucket = adminStorage.bucket();
      const storageFile = bucket.file(storagePath);
      await storageFile.save(buffer, {
        contentType: file.type || "application/octet-stream",
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      });

      try {
        await storageFile.makePublic();
        fileUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
      } catch (e) {
        const [signedUrl] = await storageFile.getSignedUrl({
          action: "read",
          expires: "03-01-2030",
        });
        fileUrl = signedUrl;
      }
    } catch (storageErr) {
      console.warn("Storage upload fallback:", storageErr);
      fileUrl = `/uploads/${sanitizedFileName}`;
    }

    const newRequest = {
      type: "PRINT_3D",
      status: "NEW",
      templateId: null,
      name,
      phone,
      address,
      details,
      fileName: file.name,
      fileUrl,
      printingCostEGP: null,
      deliveryFeeEGP: 150,
      totalEGP: null,
      adminNotes: null,
      createdAtIso: new Date().toISOString(),
    };

    let requestId = `print_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    try {
      const docRef = await adminDb.collection("requests").add({
        ...newRequest,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      requestId = docRef.id;
    } catch (fsErr) {
      console.warn("Firestore write fallback for 3D print:", fsErr);
    }

    // Write to Firebase Realtime Database
    await saveCustomerRequestToRTDB(requestId, {
      ...newRequest,
      id: requestId,
    });

    return NextResponse.json(
      {
        success: true,
        id: requestId,
        fileName: file.name,
        fileUrl,
        message: "File received and saved to Realtime Database.",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error processing 3D print request:", err);
    return NextResponse.json(
      { error: "Failed to process print request: " + err.message },
      { status: 500 }
    );
  }
}
