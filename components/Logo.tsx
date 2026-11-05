import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  showWordmark?: boolean;
  className?: string;
  size?: number;
}

export function Logo({
  variant = "default",
  showWordmark = true,
  className = "",
  size = 40,
}: LogoProps) {
  let fluxColor = "text-cloud";
  let frameColor = "text-lime";

  if (variant === "light") {
    fluxColor = "text-ink";
    frameColor = "text-violet";
  } else if (variant === "dark") {
    fluxColor = "text-cloud";
    frameColor = "text-cloud";
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime rounded-xl transition ${className}`}
      aria-label="FluxFrame home"
    >
      <div className="relative shrink-0 overflow-hidden rounded-xl flex items-center justify-center">
        {/* Real Brand Logo Icon */}
        <img
          src="/logo-icon.png"
          alt="FluxFrame icon"
          width={size}
          height={size}
          className="object-contain"
        />
      </div>

      {showWordmark && (
        <span className="font-display text-2xl font-bold tracking-tight">
          <span className={fluxColor}>Flux</span>
          <span className="text-violet">Frame</span>
        </span>
      )}
    </Link>
  );
}
