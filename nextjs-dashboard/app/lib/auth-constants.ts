export const ADMIN_EMAIL = 'user@nextmail.com';

export function normalizeEmail(email?: string | null) {
  return String(email ?? '').trim().toLowerCase();
}

export function isAdminEmail(email?: string | null) {
  return normalizeEmail(email) === ADMIN_EMAIL;
}