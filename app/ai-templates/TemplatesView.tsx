"use client";

import React from "react";
import { TemplateGrid } from "@/components/TemplateGrid";
import { TemplateData } from "@/components/TemplateCard";
import { useLanguage } from "@/components/LanguageProvider";

export function AITemplatesView({ templates }: { templates: TemplateData[] }) {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-lime px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink mb-4">
          {t("templatesCatalogueEyebrow")}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.15] tracking-[-0.02em] text-cloud mb-6">
          {t("templatesPageTitle")}
        </h1>
        <p className="text-lg leading-[1.7] text-cloud/70">
          {t("templatesPageDesc")}
        </p>
      </div>

      <TemplateGrid templates={templates} />
    </div>
  );
}

