"use client";

import React, { useState } from "react";
import { PromptSnippet } from "./PromptSnippet";
import { RequestModal } from "./RequestModal";
import { formatEGP } from "@/lib/format";
import { useLanguage } from "./LanguageProvider";

export interface TemplateData {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceEGP: number;
  coverImage: string;
  profileImage: string;
  promptSnippet: string;
  isActive?: boolean;
}

interface TemplateCardProps {
  template: TemplateData;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { t, lang } = useLanguage();

  return (
    <>
      <article className="group flex flex-col rounded-[2rem] bg-cloud text-ink overflow-hidden border border-white/10 shadow-lg transition hover:shadow-2xl">
        {/* Cover Image & Profile Overlay */}
        <div className="relative w-full h-52 bg-ink/10 overflow-hidden">
          <img
            src={template.coverImage || "/uploads/brand-cover.svg"}
            alt={template.title}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute -bottom-6 start-6 w-16 h-16 rounded-2xl border-4 border-cloud bg-ink overflow-hidden shadow-md">
            <img
              src={template.profileImage || "/uploads/brand-profile.svg"}
              alt={`${template.title} icon`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6 pt-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-violet">
              {lang === "ar" ? "نظام هوية بصرية" : "AI Identity System"}
            </span>
            <span className="font-display text-2xl font-semibold text-ink">
              {formatEGP(template.priceEGP, lang)}
            </span>
          </div>

          <h3 className="font-display text-2xl font-semibold leading-tight text-ink mb-3">
            {template.title}
          </h3>

          <p className="text-ink/70 text-base leading-[1.65] line-clamp-3 mb-6">
            {template.description}
          </p>

          <div className="mb-6 mt-auto">
            <PromptSnippet snippet={template.promptSnippet} />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 text-[15px] font-medium text-ink transition hover:bg-ink hover:text-cloud focus-visible:ring-2 focus-visible:ring-lime cursor-pointer"
          >
            {t("requestThisService")}
          </button>
        </div>
      </article>

      <RequestModal
        template={{
          id: template.id,
          title: template.title,
          priceEGP: template.priceEGP,
        }}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
