import React from "react";

export type RequestStatus =
  | "NEW"
  | "REVIEWED"
  | "QUOTED"
  | "PAID"
  | "DELIVERED"
  | "CANCELLED";

interface StatusBadgeProps {
  status: RequestStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let badgeStyle = "bg-white/10 text-cloud";

  switch (status) {
    case "NEW":
      badgeStyle = "bg-lime text-ink font-semibold";
      break;
    case "REVIEWED":
      badgeStyle = "bg-violet text-cloud";
      break;
    case "QUOTED":
      badgeStyle = "border border-lime text-lime";
      break;
    case "PAID":
      badgeStyle = "bg-cloud text-ink font-medium";
      break;
    case "DELIVERED":
      badgeStyle = "bg-lime text-ink font-bold";
      break;
    case "CANCELLED":
      badgeStyle = "bg-danger text-cloud";
      break;
    default:
      badgeStyle = "bg-white/10 text-cloud";
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-sans uppercase tracking-wider ${badgeStyle}`}
    >
      {status}
    </span>
  );
}

