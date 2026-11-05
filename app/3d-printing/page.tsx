"use client";

import React from "react";
import { PrintForm } from "@/components/PrintForm";
import { useLanguage } from "@/components/LanguageProvider";

export default function ThreeDPrintingPage() {
  const { t } = useLanguage();

  const steps = [
    {
      num: "01",
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      num: "02",
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      num: "03",
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
    {
      num: "04",
      title: t("step4Title"),
      desc: t("step4Desc"),
    },
    {
      num: "05",
      title: t("step5Title"),
      desc: t("step5Desc"),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-lime px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink mb-4">
          {t("printPageEyebrow")}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.15] tracking-[-0.02em] text-cloud mb-6">
          {t("printPageTitle")}
        </h1>
        <p className="text-lg leading-[1.7] text-cloud/70">
          {t("printPageDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Upload Form Column */}
        <div className="lg:col-span-7">
          <PrintForm />
        </div>

        {/* Right Column: How it works dark card with 5 steps */}
        <div className="lg:col-span-5 rounded-[2rem] bg-white/5 border border-white/10 p-8 md:p-10 text-cloud">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-lime mb-3">
            {t("workflowEyebrow")}
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold leading-tight mb-8">
            {t("workflowTitle")}
          </h2>

          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-4 items-start">
                <span className="font-sans text-sm font-semibold text-lime px-2.5 py-1 rounded-lg bg-lime/10 shrink-0">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-cloud mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-cloud/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-cloud/70">
            <span>{t("turnaroundBadge")}</span>
            <span className="text-lime font-sans font-medium">{t("shippingBadge")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
