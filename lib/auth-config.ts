export const AUTHORIZED_ADMIN_EMAILS = [
  "omarmohamedflux8824@gmail.com",
  "mohamedheshamflux8824@gmail.com",
] as const;

export type AuthorizedAdminEmail = (typeof AUTHORIZED_ADMIN_EMAILS)[number];

export function isAuthorizedAdmin(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalized);
}

