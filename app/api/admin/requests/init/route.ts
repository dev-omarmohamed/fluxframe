import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdminToken } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

const RTDB_URL =
  process.env.FIREBASE_DATABASE_URL ||
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  "https://fluxframe-f4103-default-rtdb.firebaseio.com";

export async function GET(req: NextRequest) {
  const authResult = await verifyAdminToken(req);
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    let templates: any[] = [];
    let requests: any[] = [];
    const hasServiceAccountKey = Boolean(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);

    // 1. Fetch templates from Firestore if service account key is available
    if (hasServiceAccountKey) {
      try {
        const templateSnapshot = await adminDb.collection("templates").get();
        templates = templateSnapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            slug: d.slug || doc.id,
            title: d.title || "",
            description: d.description || "",
            priceEGP: typeof d.priceEGP === "number" ? d.priceEGP : 400,
            fullPrompt: d.fullPrompt || "",
            isActive: d.isActive ?? true,
            coverImage: d.coverImage || "",
            profileImage: d.profileImage || "",
            promptSnippet: d.promptSnippet || "",
          };
        });
      } catch (e: any) {
        console.warn("Firestore templates query notice:", e.message);
      }
    }

    // Default template fallback if templates collection is empty or running without private key
    if (templates.length === 0) {
      templates = [
        {
          id: "ai-powered-full-brand-identity",
          slug: "ai-powered-full-brand-identity",
          title: "هوية بصرية متكاملة بالذكاء الاصطناعي",
          description:
            "بناء وتصميم هوية بصرية كاملة تبدأ من أيقونة تطبيق واحدة، مع توفير الأوامر الهندسية الدقيقة لإنشاء جميع مواد البراند وتسليمها كملف PDF احترافي.",
          priceEGP: 400,
          fullPrompt:
            "Generate a complete brand identity based on the provided core application icon. Use this single icon as the foundation for the entire design. Do not create different logos. Your task is to apply this core icon consistently across all brand assets to create a cohesive visual identity. Generate the following assets: Business cards (front and back), letterheads, envelopes, social media profile and cover images, email signature templates, banners (web and print), and a brand style guide page showing the color palette, typography, and icon usage. All generated images must strictly use the same core icon. The final output should resemble a professional brand identity document.",
          isActive: true,
          coverImage: "/uploads/brand-cover.svg",
          profileImage: "/uploads/brand-profile.svg",
          promptSnippet:
            "Generate a complete brand identity from one core app icon. Business cards, letterheads, socials, banners and a style guide.",
        },
      ];
    }

    // 2. Fetch requests from Realtime Database (Primary)
    try {
      const rtdbRes = await fetch(`${RTDB_URL}/requests.json`, {
        signal: AbortSignal.timeout(3000),
      });
      if (rtdbRes.ok) {
        const rtdbData = await rtdbRes.json();
        if (rtdbData) {
          requests = Object.keys(rtdbData).map((key) => {
            const d = rtdbData[key];
            return {
              id: key,
              type: d.type || "AI_TEMPLATE",
              status: d.status || "NEW",
              templateId: d.templateId || null,
              name: d.name || "",
              phone: d.phone || "",
              details: d.details || "",
              address: d.address || null,
              fileName: d.fileName || null,
              fileUrl: d.fileUrl || null,
              printingCostEGP: d.printingCostEGP ?? null,
              deliveryFeeEGP: typeof d.deliveryFeeEGP === "number" ? d.deliveryFeeEGP : 150,
              totalEGP: d.totalEGP ?? (d.type === "AI_TEMPLATE" ? 400 : null),
              adminNotes: d.adminNotes || null,
              createdAt: d.createdAtIso || new Date(d.timestamp || Date.now()).toISOString(),
              source: "rtdb",
            };
          });
        }
      }
    } catch (rtdbErr: any) {
      console.warn("RTDB fetch warning:", rtdbErr.message);
    }

    // 3. If Firestore is active, merge any additional Firestore requests
    if (hasServiceAccountKey) {
      try {
        const requestSnapshot = await adminDb.collection("requests").get();
        requestSnapshot.docs.forEach((doc) => {
          if (!requests.some((r) => r.id === doc.id)) {
            const d = doc.data();
            requests.push({
              id: doc.id,
              type: d.type || "AI_TEMPLATE",
              status: d.status || "NEW",
              templateId: d.templateId || null,
              name: d.name || "",
              phone: d.phone || "",
              details: d.details || "",
              address: d.address || null,
              fileName: d.fileName || null,
              fileUrl: d.fileUrl || null,
              printingCostEGP: d.printingCostEGP ?? null,
              deliveryFeeEGP: typeof d.deliveryFeeEGP === "number" ? d.deliveryFeeEGP : 150,
              totalEGP: d.totalEGP ?? null,
              adminNotes: d.adminNotes || null,
              createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : null,
              source: "firestore",
            });
          }
        });
      } catch (e) {}
    }

    return NextResponse.json({ templates, requests });
  } catch (err: any) {
    console.error("Admin init error:", err);
    return NextResponse.json({ error: "Failed to initialize admin dashboard: " + err.message }, { status: 500 });
  }
}
