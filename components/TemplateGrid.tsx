import React from "react";
import { TemplateCard, TemplateData } from "./TemplateCard";

interface TemplateGridProps {
  templates: TemplateData[];
}

export function TemplateGrid({ templates }: TemplateGridProps) {
  if (!templates || templates.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center text-cloud">
        <h3 className="font-display text-2xl font-semibold mb-2">No templates found</h3>
        <p className="text-cloud/70 text-base max-w-md mx-auto">
          Please run the seed script to populate the template catalogue into Firestore.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {templates.map((tpl) => (
        <TemplateCard key={tpl.id} template={tpl} />
      ))}
    </div>
  );
}

