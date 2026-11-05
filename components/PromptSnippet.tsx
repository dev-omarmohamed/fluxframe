"use client";

import React from "react";
import { useLanguage } from "./LanguageProvider";

interface PromptSnippetProps {
  snippet: string;
  label?: string;
  className?: string;
}

export function PromptSnippet({
  snippet,
  label,
  className = "",
}: PromptSnippetProps) {
  const { t } = useLanguage();
  const displayLabel = label || t("coreAiFoundation");

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-ink p-4 ${className}`}
    >
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-lime mb-2">
        {displayLabel}
      </div>
      <p className="font-sans text-[13px] leading-[1.6] text-cloud/70 select-all" dir="ltr">
        {snippet}
      </p>
    </div>
  );
}
