"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowUpLeft, Check, Sparkles, Video, Image as ImageIcon, Flame } from "lucide-react";
import { Button } from "@/components/Button";
import { useLanguage } from "@/components/LanguageProvider";
import { RequestModal } from "@/components/RequestModal";
import { ContentModal, CONTENT_PACKAGES } from "@/components/ContentModal";
import { formatEGP } from "@/lib/format";

export default function HomePage() {
  const { t, dir, lang } = useLanguage();
  const ArrowIcon = dir === "rtl" ? ArrowUpLeft : ArrowUpRight;

  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedContentPkg, setSelectedContentPkg] = useState("growth");

  const openContentPackage = (pkgId: string) => {
    setSelectedContentPkg(pkgId);
    setIsContentModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-14 md:py-20">
      {/* Hero Section */}
      <section className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-lime px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink mb-6">
          {t("studio")}
        </div>

        <h1 className="font-display text-[38px] md:text-[58px] lg:text-[66px] font-semibold leading-[1.12] tracking-[-0.02em] text-cloud mb-7">
          {lang === "ar" ? (
            <>
              هويات بصرية متكاملة، فيديوهات ومحتوى AI، وطباعة 3D.{" "}
              <span className="text-lime">{t("taglineHighlight")}</span>
            </>
          ) : (
            <>
              Brand identities, AI social content, and 3D printing.{" "}
              <span className="text-lime">{t("taglineHighlight")}</span>
            </>
          )}
        </h1>

        <p className="text-lg md:text-xl leading-[1.7] text-cloud/70 max-w-2xl mb-9">
          {t("heroSubtitle")}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setIsIdentityModalOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-lime px-6 py-3.5 text-[15px] font-semibold text-ink hover:bg-cloud transition cursor-pointer shadow-lg"
          >
            {t("exploreTemplates")}
          </button>
          <a
            href="#ai-content"
            className="inline-flex items-center justify-center rounded-full border border-violet bg-violet/10 px-6 py-3.5 text-[15px] font-medium text-cloud hover:bg-violet hover:text-cloud transition cursor-pointer"
          >
            {t("exploreContent")}
          </a>
          <Button href="/3d-printing" variant="secondary">
            {t("upload3DModel")}
          </Button>
        </div>
      </section>

      {/* Primary Services Grid: 2-Column (Full Identity & 3D Printing) */}
      <section className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: AI Brand Identity (1,000 EGP) */}
        <div className="rounded-[2rem] bg-cloud text-ink p-8 md:p-10 flex flex-col justify-between shadow-2xl border border-white/10">
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-violet">
                {t("card1Category")}
              </span>
              <span className="font-display text-3xl font-bold text-ink">
                {t("card1Price")}
              </span>
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-semibold leading-tight text-ink mb-4">
              {t("card1Title")}
            </h3>

            <p className="text-ink/75 text-base leading-[1.65] mb-6 font-medium">
              {t("card1Desc")}
            </p>

            <ul className="space-y-3 mb-8">
              {(t("card1Features") as string[]).map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink font-medium">
                  <div className="w-5 h-5 rounded-full bg-violet/10 text-violet flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t border-ink/10">
            <button
              onClick={() => setIsIdentityModalOpen(true)}
              className="inline-flex items-center justify-center w-full rounded-2xl bg-violet px-6 py-4 text-[15px] font-semibold text-cloud hover:bg-ink transition cursor-pointer shadow"
            >
              <span>{lang === "ar" ? "طلب باقة الهوية الكاملة (1,000 ج.م)" : "Order Full Brand Identity (1,000 EGP)"}</span>
            </button>
            <Link
              href="/ai-templates"
              className="inline-flex items-center justify-between w-full rounded-2xl border border-ink/20 px-6 py-3.5 text-sm font-medium text-ink hover:bg-ink/5 transition"
            >
              <span>{t("viewTemplatesAndPrompts")}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card 2: 3D Printing */}
        <div className="rounded-[2rem] bg-violet text-cloud p-8 md:p-10 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-lime">
                {t("card2Category")}
              </span>
              <span className="font-display text-2xl font-bold text-lime">
                {t("card2Price")}
              </span>
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-semibold leading-tight text-cloud mb-4">
              {t("card2Title")}
            </h3>

            <p className="text-cloud/80 text-base leading-[1.65] mb-6 font-medium">
              {t("card2Desc")}
            </p>

            <ul className="space-y-3 mb-8">
              {(t("card2Features") as string[]).map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-cloud font-medium">
                  <div className="w-5 h-5 rounded-full bg-lime/20 text-lime flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/3d-printing"
            className="inline-flex items-center justify-between w-full rounded-2xl bg-lime px-6 py-4 text-[15px] font-semibold text-ink hover:bg-cloud transition shadow"
          >
            <span>{t("upload3DModelCta")}</span>
            <ArrowIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Featured Section: AI Reels & Social Media Posts with 3 Packages */}
      <section id="ai-content" className="mt-16 md:mt-24 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/15 p-8 md:p-12 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet/20 border border-violet/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-lime mb-3">
              <Sparkles className="w-3.5 h-3.5 text-lime" />
              <span>{t("cardContentCategory")}</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-cloud mb-3">
              {t("cardContentTitle")}
            </h2>
            <p className="text-cloud/70 text-base leading-relaxed">
              {t("cardContentDesc")}
            </p>
          </div>

          {/* Rate Highlights */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="rounded-2xl bg-ink/60 border border-white/10 px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet/20 text-violet flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-cloud/50 font-medium">
                  {lang === "ar" ? "فيديوهات ريلز وشورتس" : "Reels / Shorts"}
                </div>
                <div className="text-sm font-bold text-lime">
                  {t("cardContentRateVideo")}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-ink/60 border border-white/10 px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-lime/20 text-lime flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-cloud/50 font-medium">
                  {lang === "ar" ? "بوستات وتصاميم السوشيال" : "Post Creatives"}
                </div>
                <div className="text-sm font-bold text-cloud">
                  {t("cardContentRateImage")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The 3 Packages Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTENT_PACKAGES.map((pkg) => {
            const isGrowth = pkg.id === "growth";
            return (
              <div
                key={pkg.id}
                className={`relative rounded-[2rem] p-6 md:p-8 flex flex-col justify-between transition hover:-translate-y-1 ${
                  isGrowth
                    ? "bg-violet text-cloud border-2 border-lime shadow-2xl"
                    : "bg-ink/70 text-cloud border border-white/10 hover:border-white/20"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 end-6 inline-flex items-center gap-1 rounded-full bg-lime text-ink px-3 py-1 text-xs font-bold uppercase tracking-wider shadow">
                    <Flame className="w-3.5 h-3.5 fill-ink" />
                    <span>{t("contentPkg2Badge")}</span>
                  </div>
                )}

                <div>
                  <h3 className="font-display text-xl font-bold mb-2">
                    {t(pkg.nameKey as any)}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-display text-3xl font-extrabold text-lime">
                      {formatEGP(pkg.priceEGP, lang)}
                    </span>
                  </div>

                  <div className="rounded-xl bg-white/10 px-3.5 py-2 mb-5 font-semibold text-xs text-cloud border border-white/10">
                    {t(pkg.itemsKey as any)}
                  </div>

                  <p className="text-xs md:text-sm text-cloud/80 leading-relaxed mb-6 font-medium">
                    {t(pkg.descKey as any)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openContentPackage(pkg.id)}
                  className={`w-full inline-flex items-center justify-center rounded-2xl py-3.5 px-5 text-sm font-bold transition cursor-pointer shadow ${
                    isGrowth
                      ? "bg-lime text-ink hover:bg-cloud"
                      : "bg-white/10 text-cloud hover:bg-lime hover:text-ink border border-white/15"
                  }`}
                >
                  {t("requestThisService")}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Strip */}
      <section className="mt-16 md:mt-24 border border-white/10 rounded-[2rem] bg-white/5 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-lime mb-2">
              01 · {lang === "ar" ? "سرعة في التنفيذ" : "Fast Turnaround"}
            </div>
            <h4 className="font-display text-xl font-semibold text-cloud mb-2">
              {t("trust1Title")}
            </h4>
            <p className="text-sm text-cloud/70 leading-relaxed">
              {t("trust1Desc")}
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-lime mb-2">
              02 · {lang === "ar" ? "تكلفة واضحة وثابتة" : "Transparent Rates"}
            </div>
            <h4 className="font-display text-xl font-semibold text-cloud mb-2">
              {t("trust2Title")}
            </h4>
            <p className="text-sm text-cloud/70 leading-relaxed">
              {t("trust2Desc")}
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-lime mb-2">
              03 · {lang === "ar" ? "تواصل بشري مباشر" : "Direct Human Chat"}
            </div>
            <h4 className="font-display text-xl font-semibold text-cloud mb-2">
              {t("trust3Title")}
            </h4>
            <p className="text-sm text-cloud/70 leading-relaxed">
              {t("trust3Desc")}
            </p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <RequestModal
        template={{
          id: "full-brand-identity",
          title: lang === "ar" ? "الهوية البصرية المتكاملة والموك آبس" : "Full Brand Identity & Mockups",
          priceEGP: 1000,
        }}
        isOpen={isIdentityModalOpen}
        onClose={() => setIsIdentityModalOpen(false)}
      />

      <ContentModal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
        initialPackageId={selectedContentPkg}
      />
    </div>
  );
}
