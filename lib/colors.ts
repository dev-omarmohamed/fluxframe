export const colors = {
  ink: "#0B0B0F",
  cloud: "#F5F7FA",
  violet: "#7F00FF",
  lime: "#C6FF00",
  danger: "#FF3B30",
  white10: "rgba(255, 255, 255, 0.10)",
  white5: "rgba(255, 255, 255, 0.05)",
  ink70: "rgba(11, 11, 15, 0.70)",
  ink10: "rgba(11, 11, 15, 0.10)",
} as const;

export type ColorToken = keyof typeof colors;

