"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function PrintForm() {
  const { t, lang } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Human Verification (Anti-bot / Anti-duplication)
  const [mathA, setMathA] = useState(4);
  const [mathB, setMathB] = useState(5);
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
    generateNewMathQuestion();
  }, []);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const ext = "." + selectedFile.name.split(".").pop()?.toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        setError(
          lang === "ar"
            ? `صيغة الملف غير مدعومة. الصيغ المتاحة: ${allowedExtensions.join(", ")}`
            : `Invalid file format. Supported: ${allowedExtensions.join(", ")}`
        );
        return;
      }
      if (selectedFile.size > 25 * 1024 * 1024) {
        setError(
          lang === "ar"
            ? "حجم الملف يتجاوز الحد الأقصى (25 ميجابايت)."
            : "File size exceeds 25 MB limit."
        );
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti-double click debounce guard (at least 3 seconds)
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

    if (!file) {
      setError(
        lang === "ar"
          ? "يرجى اختيار ملف مجسم 3D أو رسم هندسي للرفع."
          : "Please select a 3D model, drawing, or reference file to upload."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload multipart file and register request in backend API ONLY
      // This prevents duplicate writes to Realtime Database
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("phone", phone.trim());
      formData.append("address", address.trim());
      formData.append("details", details.trim());
      formData.append("file", file);
      formData.append("userMathAnswer", String(userVal));
      formData.append("expectedMathAnswer", String(expected));
      formData.append("hp_trap", honeypot);

      const res = await fetch("/api/requests/print", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ||
            (lang === "ar"
              ? "فشل إرسال طلب الطباعة"
              : "Failed to submit 3D print request")
        );
      }

      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.message ||
          (lang === "ar"
            ? "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى."
            : "Something went wrong submitting your request.")
      );
      generateNewMathQuestion();
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-[2rem] bg-lime p-8 md:p-10 text-ink shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-ink stroke-[2.5]" />
          <h2 className="font-display text-2xl md:text-3xl font-semibold">
            {t("printFormSuccessTitle")}
          </h2>
        </div>
        <p className="text-base md:text-lg font-medium leading-relaxed">
          {t("printFormSuccessDesc")}
        </p>
        <div className="pt-4">
          <button
            onClick={() => {
              setSuccess(false);
              setName("");
              setPhone("");
              setAddress("");
              setDetails("");
              setFile(null);
              setCaptchaAnswer("");
              generateNewMathQuestion();
            }}
            className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-cloud hover:bg-ink/80 transition cursor-pointer"
          >
            {t("printSubmitAnother")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] bg-cloud text-ink p-8 md:p-10 shadow-xl">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-violet mb-2">
        {t("printFormEyebrow")}
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-semibold leading-tight mb-2">
        {t("printFormTitle")}
      </h2>
      <p className="text-ink/70 text-base mb-6">
        {t("printFormDesc")}
      </p>

      {error && (
        <div className="mb-6 rounded-2xl bg-danger/10 border border-danger/20 p-4 text-sm text-danger font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-ink">
              {t("printFormName")}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عمر طارق"
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 outline-none focus:border-violet focus:ring-2 focus:ring-violet/30 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-ink">
              {t("printFormPhone")}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="مثال: 01234567890"
              dir="ltr"
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 outline-none focus:border-violet focus:ring-2 focus:ring-violet/30 transition text-start"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-ink">
            {t("printFormAddress")}
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t("printFormAddressPlaceholder")}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 outline-none focus:border-violet focus:ring-2 focus:ring-violet/30 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-ink">
            {t("printFormDetails")}
          </label>
          <textarea
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={t("printFormDetailsPlaceholder")}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 outline-none focus:border-violet focus:ring-2 focus:ring-violet/30 transition resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-ink">
            {t("printFormFile")}
          </label>
          <input
            type="file"
            required
            accept=".stl,.obj,.3mf,.step,.stp,.pdf,.zip,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-cloud cursor-pointer transition"
          />
          <p className="mt-1.5 text-xs text-ink/70">
            {t("printFormFileHelp")}
          </p>
        </div>

        {/* Human Verification Section */}
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
              ? (lang === "ar" ? "جارِ رفع الملف ومنع التكرار..." : "Uploading & Processing...")
              : t("printFormSubmit")}
          </button>
        </div>
      </form>
    </div>
  );
}
