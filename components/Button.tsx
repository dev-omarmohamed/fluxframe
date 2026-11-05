import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  let baseClasses = "";
  if (variant === "primary") {
    baseClasses =
      "inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 text-[15px] font-medium text-ink transition hover:bg-cloud focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50 cursor-pointer";
  } else if (variant === "secondary") {
    baseClasses =
      "inline-flex items-center justify-center gap-2 rounded-full border border-violet px-6 py-3 text-[15px] font-medium text-violet transition hover:bg-violet hover:text-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet disabled:opacity-50 cursor-pointer";
  } else if (variant === "ghost") {
    baseClasses =
      "inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-[15px] font-medium text-ink hover:bg-ink/5 transition cursor-pointer";
  }

  const combinedClasses = `${baseClasses} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}

