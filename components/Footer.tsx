"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { useLanguage } from "./LanguageProvider";

export function Footer() {
  const { t } = useLanguage();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201000000000";

  return (
    <footer className="border-t border-white/10 bg-ink py-16 text-cloud">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <Logo variant="default" />
            <p className="mt-4 text-sm text-cloud/70 max-w-sm leading-relaxed">
              {t("footerDesc")}
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-[15px]">
            <Link href="/ai-templates" className="text-cloud/70 hover:text-cloud transition">
              {t("navTemplates")}
            </Link>
            <Link href="/#ai-content" className="text-cloud/70 hover:text-cloud transition">
              {t("navContent")}
            </Link>
            <Link href="/3d-printing" className="text-cloud/70 hover:text-cloud transition">
              {t("nav3DPrinting")}
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime hover:underline transition"
            >
              {t("footerSupport")}
            </a>
            <Link href="/admin" className="text-cloud/40 hover:text-cloud/70 transition">
              {t("navAdmin")}
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cloud/70">
          <p>{t("footerCopy")}</p>
          <p className="font-sans text-[11px] text-cloud/40">
            {t("footerLocation")}
          </p>
        </div>
      </div>
    </footer>
  );
}
