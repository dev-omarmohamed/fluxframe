"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { useLanguage } from "./LanguageProvider";
import { Globe } from "lucide-react";

export function Nav() {
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLanguage();

  const navLinks = [
    { href: "/", label: t("navHome") },
    { href: "/ai-templates", label: t("navTemplates") },
    { href: "/#ai-content", label: t("navContent") },
    { href: "/3d-printing", label: t("nav3DPrinting") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-ink/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo variant="default" />

        <div className="flex items-center gap-6 md:gap-8">
          <nav aria-label="Main Navigation" className="flex items-center gap-5 md:gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[15px] font-medium transition ${
                    isActive ? "text-lime" : "text-cloud/70 hover:text-cloud"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Language Toggle Button */}
          <button
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-sans font-medium text-cloud hover:border-lime hover:text-lime transition cursor-pointer"
            title="تبديل اللغة / Switch Language"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t("langToggle")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
