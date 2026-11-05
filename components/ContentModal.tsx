"use client";

import React, { useState, useEffect } from "react";
import { X, Check, ShieldCheck, RefreshCw, Sparkles, Video, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { formatEGP } from "@/lib/format";

export interface ContentPackage {
  id: string;
  nameKey: string;
  priceEGP: number;
  itemsKey: string;
  descKey: string;
  isPopular?: boolean;
}

export const CONTENT_PACKAGES: ContentPackage[] = [
  {
    id: "starter",
    nameKey: "contentPkg1Title",
    priceEGP: 850,
    itemsKey: "contentPkg1Items",
    descKey: "contentPkg1Desc",
  },
  {
    id: "growth",
    nameKey: "contentPkg2Title",
    priceEGP: 2150,
    itemsKey: "contentPkg2Items",
    descKey: "contentPkg2Desc",
    isPopular: true,
  },
  {
    id: "pro",
    nameKey: "contentPkg3Title",
    priceEGP: 3750,
    itemsKey: "contentPkg3Items",
    descKey: "contentPkg3Desc",
  },
];

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackageId?: string;
}

export function ContentModal({ isOpen, onClose, initialPackageId = "growth" }: ContentModalProps) {
  const { t, lang } = useLanguage();
  const [selectedPkgId, setSelectedPkgId] = useState(initialPackageId);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Human Verification (Anti-bot / Anti-duplication)
  const [mathA, setMathA] = useState(5);
  const [mathB, setMathB] = useState(3);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const generateNewMathQuestion = () => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    setMathA(a);
    setMathB(b);
    setCaptchaAnswer("");
  };

  useEffect(() => {
    if (isOpen) {
      if (initialPackageId) {
        setSelectedPkgId(initialPackageId);
      }
      generateNewMathQuestion();
      setError(null);
    }
  }, [isOpen, initialPackageId]);

  if (!isOpen) return null;

  const currentPkg = CONTENT_PACKAGES.find((p) => p.id === selectedPkgId) || CONTENT_PACKAGES[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Double click debounce
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      return;
    }
    setLastSubmitTime(now);

    // 2. Honeypot check
    if (honeypot.trim() !== "") {
      setError(
        lang === "ar"
          ? "فشل التحقق الأمني. تم حظر الإرسال التلقائي."
          : "Security check failed. Automated submission blocked."
      );
      return;
    }

    // 3. Math verification
    const expected = mathA + mathB;
    const userVal = parseInt(captchaAnswer.trim(), 10);
    if (isNaN(userVal) || userVal !== expected) {
      setError(
        lang === "ar"
          ? `إجابة التحقق غير صحيحة. يرجى حساب: ${mathA} + ${mathB}`
          : `Incorrect verification answer. Please calculate: ${mathA} + ${mathB}`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: `content_${currentPkg.id}`,
          type: "AI_CONTENT",
          packageName: t(currentPkg.nameKey as any),
          priceEGP: currentPkg.priceEGP,
          name: name.trim(),
          phone: phone.trim(),
          details: details.trim(),
          hp_trap: honeypot,
          userMathAnswer: userVal,
          expectedMathAnswer: expected,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ||
            (lang === "ar" ? "فشل إرسال الطلب" : "Failed to submit request")
        );
      }

      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.message ||
          (lang === "ar"
            ? "حدث خطأ ما. يرجى المحاولة مرة أخرى."
            : "Something went wrong. Please try again.")
      );
      generateNewMathQuestion();
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setName("");
    setPhone("");
    setDetails("");
    setCaptchaAnswer("");
    setHoneypot("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-modal-title"
    >
      <div className="relative w-full max-w-xl rounded-[2rem] bg-cloud text-ink p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        <button
          onClick={resetAndClose}
          className="absolute top-6 end-6 p-2 rounded-full hover:bg-ink/10 text-ink/70 hover:text-ink transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-lime text-ink rounded-full mx-auto flex items-center justify-center">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="rounded-2xl bg-lime p-6 text-ink">
              <h2 className="font-display text-2xl font-semibold mb-2">
                {t("modalSuccessTitle")}
              </h2>
              <p className="text-[15px] font-medium leading-relaxed">
                {lang === "ar"
                  ? `تم استلام طلبك لـ "${t(currentPkg.nameKey as any)}". سنتواصل معك عبر واتساب لتسليم خطة المحتوى ومراجعة النصوص فوراً.`
                  : `Your request for "${t(currentPkg.nameKey as any)}" was received! We will reach out on WhatsApp right away.`}
              </p>
            </div>
            <button
              onClick={resetAndClose}
              className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-cloud hover:bg-ink/80 transition cursor-pointer"
            >
              {t("modalDone")}
            </button>
          </div>
        ) : (
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-violet mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet" />
              <span>{t("cardContentCategory")}</span>
            </div>
            <h2 id="content-modal-title" className="font-display text-2xl md:text-3xl font-semibold leading-tight mb-2">
              {lang === "ar" ? "طلب باقة فيديوهات ريلز وتصاميم AI" : "Order AI Reels & Social Content"}
            </h2>

            {/* Rate notice */}
            <div className="flex flex-wrap items-center gap-2 mb-5 text-xs text-ink/70 bg-white p-3 rounded-xl border border-ink/10">
              <span className="flex items-center gap-1 font-semibold text-violet">
                <Video className="w-3.5 h-3.5" />
                {t("cardContentRateVideo")}
              </span>
              <span className="text-ink/30">|</span>
              <span className="flex items-center gap-1 font-semibold text-ink">
                <ImageIcon className="w-3.5 h-3.5" />
                {t("cardContentRateImage")}
              </span>
            </div>

            {/* Package selector */}
            <div className="space-y-2.5 mb-5">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/60 block">
                {lang === "ar" ? "اختر الباقة المناسبة لمشروعك:" : "Select your package:"}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {CONTENT_PACKAGES.map((pkg) => {
                  const isSelected = pkg.id === selectedPkgId;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`p-3.5 rounded-2xl border text-start transition cursor-pointer relative ${
                        isSelected
                          ? "bg-violet text-cloud border-violet ring-2 ring-violet/30"
                          : "bg-white text-ink border-ink/10 hover:border-violet/40"
                      }`}
                    >
                      {pkg.isPopular && (
                        <span
                          className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full absolute -top-2 end-3 shadow ${
                            isSelected ? "bg-lime text-ink" : "bg-violet text-cloud"
                          }`}
                        >
                          {t("contentPkg2Badge")}
                        </span>
                      )}
                      <div className="font-display font-semibold text-sm mb-1 leading-snug">
                        {t(pkg.nameKey as any)}
                      </div>
                      <div
                        className={`text-base font-bold mb-1.5 ${
                          isSelected ? "text-lime" : "text-violet"
                        }`}
                      >
                        {formatEGP(pkg.priceEGP, lang)}
                      </div>
                      <p
                        className={`text-[11px] leading-tight font-medium ${
                          isSelected ? "text-cloud/80" : "text-ink/60"
                        }`}
                      >
                        {t(pkg.itemsKey as any)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl bg-danger/10 border border-danger/20 p-3 text-sm text-danger font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anti-bot Honeypot field */}
              <div style={{ display: "none" }} aria-hidden="true">
                <label>Do not fill this</label>
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-ink">
                    {t("modalFullName")}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("modalFullNamePlaceholder")}
                    className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 outline-none focus:border-violet focus:ring-2 focus:ring-violet/30 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-ink">
                    {t("modalPhone")}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("modalPhonePlaceholder")}
                    dir="ltr"
                    className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 outline-none focus:border-violet focus:ring-2 focus:ring-violet/30 transition text-start"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-ink">
                  {lang === "ar"
                    ? "اسم البراند ومجال النشاط / أو أفكار المحتوى المطلوبة"
                    : "Brand name, industry, or content vision"}
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={
                    lang === "ar"
                      ? "مثال: صفحة براند عطور، نحتاج ريلز تسويقية وسيناريوهات للمنتجات وبوستات لعروض الجمعة..."
                      : "e.g. Fashion brand, looking for product showreel scripts and promo posts..."
                  }
                  className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 outline-none focus:border-violet focus:ring-2 focus:ring-violet/30 transition resize-none"
                />
              </div>

              {/* Human verification / Anti-duplication section */}
              <div className="rounded-2xl border border-ink/15 bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-violet" />
                    <span>{t("modalHumanCheckLabel")}</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateNewMathQuestion}
                    className="text-xs text-violet hover:underline flex items-center gap-1 cursor-pointer"
                    title="تغيير السؤال"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{lang === "ar" ? "مسألة أخرى" : "New question"}</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-2 rounded-xl bg-violet/10 text-violet font-semibold text-base shrink-0 select-none">
                    {mathA} + {mathB} = ?
                  </div>
                  <input
                    type="number"
                    required
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder={t("modalHumanCheckPlaceholder")}
                    className="w-full rounded-xl border border-ink/10 bg-cloud px-3.5 py-2 text-base text-ink outline-none focus:border-violet"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 text-[15px] font-semibold text-ink transition hover:bg-ink hover:text-cloud focus-visible:ring-2 focus-visible:ring-lime disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {loading
                    ? (lang === "ar" ? "جارِ تأكيد الطلب ومنع التكرار..." : "Submitting...")
                    : `${lang === "ar" ? "تأكيد طلب" : "Confirm Order"} ${t(currentPkg.nameKey as any)} (${formatEGP(currentPkg.priceEGP, lang)})`}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

