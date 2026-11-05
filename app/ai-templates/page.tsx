import React from "react";
import { adminDb } from "@/lib/firebase/admin";
import { TemplateData } from "@/components/TemplateCard";
import { AITemplatesView } from "./TemplatesView";

// Exclude fullPrompt on server before sending to client
async function getTemplates(): Promise<TemplateData[]> {
  try {
    const snapshot = await adminDb
      .collection("templates")
      .where("isActive", "==", true)
      .get();

    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          slug: data.slug || doc.id,
          title: data.title || "نظام الهوية البصرية المتكاملة للمشاريع",
          description: data.description || "",
          priceEGP: typeof data.priceEGP === "number" ? data.priceEGP : 1000,
          coverImage: data.coverImage || "/uploads/brand-cover.svg",
          profileImage: data.profileImage || "/uploads/brand-profile.svg",
          promptSnippet: data.promptSnippet || "",
          isActive: data.isActive,
        };
      });
    }
  } catch (err) {
    console.warn("Could not fetch templates from Firestore:", err);
  }

  // Fallback template for Arabic initial preview
  return [
    {
      id: "ai-powered-full-brand-identity",
      slug: "ai-powered-full-brand-identity",
      title: "الهوية البصرية المتكاملة وملفات الشعار والموك آبس",
      description:
        "كل ما تحتاجه لبدء علامتك التجارية: ملفات الشعار المصدرية بجميع الصيغ (Vector SVG, PNG شفاف, PDF) مع موك آبس واقعية شاملة ودليل استخدام كامل.",
      priceEGP: 1000,
      coverImage: "/uploads/brand-cover.svg",
      profileImage: "/uploads/brand-profile.svg",
      promptSnippet:
        "Generate a complete startup brand identity system. Vector SVG logos, transparent PNGs, print-ready PDF, photorealistic mockups (packaging, stationery, apparel) and brand guidelines.",
      isActive: true,
    },
  ];
}

export const dynamic = "force-dynamic";

export default async function AITemplatesPage() {
  const templates = await getTemplates();
  return <AITemplatesView templates={templates} />;
}
