"use client";

import React, { useState, useEffect } from "react";
import { X, Check, ShieldCheck, RefreshCw } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { formatEGP } from "@/lib/format";

interface RequestModalProps {
  template: {
    id: string;
    title: string;
    priceEGP: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function RequestModal({ template, isOpen, onClose }: RequestModalProps) {
  const { t, lang } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Human Verification (Anti-bot / Anti-duplication)
  const [mathA, setMathA] = useState(3);
  const [mathB, setMathB] = useState(4);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [honeypot, setHoneypot] = useState(""); // hidden field; must be empty
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
      generateNewMathQuestion();
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti-double click debounce guard (at least 3 seconds between clicks)
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      return;
    }
    setLastSubmitTime(now);

    // 2. Honeypot check (reject automated spam bots silently or with error)
    if (honeypot.trim() !== "") {
      setError(
        lang === "ar"
          ? "فشل التحقق الأمني. تم حظر الإرسال التلقائي."
          : "Security check failed. Automated submission blocked."
      );
      return;
    }

    // 3. Human verification math check
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
      // Send ONLY through backend API to guarantee exactly one single write to Realtime DB
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          name: name.trim(),
          phone: phone.trim(),
          details: details.trim(),
          hp_trap: honeypot,
          userMathAnswer: userVal,
          expectedMathAnswer: expected,
          priceEGP: template.priceEGP || 1000,
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
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg rounded-[2rem] bg-cloud text-ink p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
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
                {t("modalSuccessDesc")}
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
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-violet mb-2">
              {t("modalOrderInitiation")}
            </div>
            <h2 id="modal-title" className="font-display text-2xl font-semibold leading-tight mb-1">
              {t("modalRequestPrefix")} {template.title}
            </h2>
            <div className="rounded-xl bg-violet/5 border border-violet/15 p-3.5 my-4">
              <p className="text-xs text-ink/80 leading-relaxed font-medium">
                {lang === "ar"
                  ? "تشمل الباقة: ملفات الشعار المصدرية كاملة (Vector SVG, PNG شفاف, PDF عالي الجودة) + موك آبس واقعية لكل استخدامات البراند."
                  : "Includes full logo vector files (SVG, transparent PNG, PDF) + realistic commercial mockups."}
              </p>
              <p className="text-sm font-semibold text-ink mt-1">
                {lang === "ar"
                  ? `السعر الإجمالي: ${formatEGP(template.priceEGP || 1000, "ar")} فقط.`
                  : `Total package price: ${formatEGP(template.priceEGP || 1000, "en")}.`}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl bg-danger/10 border border-danger/20 p-3 text-sm text-danger font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anti-bot Honeypot field (hidden from real users) */}
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

              <div>
                <label className="block text-sm font-medium mb-1.5 text-ink">
                  {t("modalDetails")}
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={t("modalDetailsPlaceholder")}
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
                    ? (lang === "ar" ? "جارِ الإرسال ومنع التكرار..." : "Submitting...")
                    : `${t("modalSubmit")} (${formatEGP(template.priceEGP || 1000, lang)})`}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
