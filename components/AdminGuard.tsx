"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useLanguage } from "./LanguageProvider";
import { isAuthorizedAdmin, AUTHORIZED_ADMIN_EMAILS } from "@/lib/auth-config";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, signIn, signOut, getIdToken } = useAuth();
  const { t, lang } = useLanguage();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const getUnauthorizedMessage = () =>
    lang === "ar"
      ? `تم رفض الوصول. تسجيل الدخول مصرح به فقط لـ:\n${AUTHORIZED_ADMIN_EMAILS.join(" و ")}`
      : `Access denied. Only authorized administrators (${AUTHORIZED_ADMIN_EMAILS.join(", ")}) can sign in.`;

  useEffect(() => {
    async function verify() {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      // Client-side whitelist check
      if (!isAuthorizedAdmin(user.email)) {
        await signOut();
        setIsAdmin(false);
        setError(getUnauthorizedMessage());
        return;
      }

      setVerifying(true);
      setError(null);
      try {
        const token = await getIdToken(true);
        if (!token) {
          throw new Error("Unable to obtain auth token");
        }
        const res = await fetch("/api/admin/verify-admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setIsAdmin(true);
        } else {
          const resData = await res.json().catch(() => ({}));
          await signOut();
          setIsAdmin(false);
          setError(resData.error || getUnauthorizedMessage());
        }
      } catch (err: any) {
        await signOut();
        setIsAdmin(false);
        setError(err?.message || getUnauthorizedMessage());
      } finally {
        setVerifying(false);
      }
    }

    if (!authLoading) {
      if (user) {
        verify();
      } else {
        setIsAdmin(false);
      }
    }
  }, [user, authLoading, lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Pre-check email against whitelist
    if (!isAuthorizedAdmin(email)) {
      setError(getUnauthorizedMessage());
      return;
    }

    setVerifying(true);
    try {
      const signedInUser = await signIn(email.trim(), password);

      if (!isAuthorizedAdmin(signedInUser.email)) {
        await signOut();
        setIsAdmin(false);
        setError(getUnauthorizedMessage());
        return;
      }

      const token = await signedInUser.getIdToken(true);
      const res = await fetch("/api/admin/verify-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setIsAdmin(true);
      } else {
        const resData = await res.json().catch(() => ({}));
        await signOut();
        setIsAdmin(false);
        setError(resData.error || getUnauthorizedMessage());
      }
    } catch (err: any) {
      setError(
        err?.message ||
          (lang === "ar" ? "بيانات الدخول غير صحيحة" : "Invalid credentials")
      );
      setIsAdmin(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleSelectAdmin = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setPassword(selectedEmail);
  };

  if (authLoading || verifying) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet border-t-lime rounded-full animate-spin mb-4" />
        <p className="text-cloud/70 font-sans text-sm">
          {lang === "ar"
            ? "جارِ التحقق من صلاحيات المسؤول..."
            : "Verifying administrator credentials..."}
        </p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-cloud text-ink rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-violet mb-2">
            {t("adminPortal")}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold leading-tight mb-2">
            {t("adminSignInTitle")}
          </h1>
          <p className="text-ink/70 text-sm mb-4 leading-relaxed">
            {lang === "ar"
              ? "الدخول مقتصر حصرياً على حسابات المسؤولين المعتمدين:"
              : "Access is strictly restricted to authorized administrator accounts:"}
          </p>

          {/* Quick preset buttons for the 2 authorized admins */}
          <div className="mb-6 space-y-2">
            {AUTHORIZED_ADMIN_EMAILS.map((accEmail) => (
              <button
                key={accEmail}
                type="button"
                onClick={() => handleSelectAdmin(accEmail)}
                className="w-full text-start p-2.5 rounded-xl border border-ink/10 bg-white hover:border-violet hover:bg-violet/5 transition flex items-center justify-between text-xs font-sans text-ink cursor-pointer"
              >
                <span className="truncate">{accEmail}</span>
                <span className="text-[10px] bg-lime text-ink px-2 py-0.5 rounded-full font-sans font-semibold shrink-0 ms-2">
                  {lang === "ar" ? "تعبئة تلقائية" : "Auto-fill"}
                </span>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-danger/10 border border-danger/20 p-4 text-xs text-danger font-medium whitespace-pre-line leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-ink">
                {t("adminEmailLabel")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="omarmohamedflux8824@gmail.com"
                dir="ltr"
                className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 outline-none focus:border-violet focus:ring-2 focus:ring-violet/30 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-ink">
                {t("adminPasswordLabel")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                dir="ltr"
                className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 outline-none focus:border-violet focus:ring-2 focus:ring-violet/30 transition"
              />
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 text-[15px] font-medium text-ink transition hover:bg-ink hover:text-cloud focus-visible:ring-2 focus-visible:ring-lime disabled:opacity-50 mt-4 cursor-pointer"
            >
              {verifying
                ? (lang === "ar" ? "جارِ التحقق..." : "Authenticating...")
                : t("adminAuthBtn")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
