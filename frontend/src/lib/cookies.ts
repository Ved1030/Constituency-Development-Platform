/**
 * Reusable cookie utility.
 *
 * All functions are SSR-safe — they return early / no-op when `document`
 * is not available (server-side rendering, test environments, etc.).
 */

function isClient(): boolean {
  return typeof document !== "undefined";
}

/**
 * Read a cookie value by name.
 * Returns `null` when the cookie is missing or when running on the server.
 */
export function getCookie(name: string): string | null {
  if (!isClient()) return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Set a cookie. Defaults to 365-day expiry.
 */
export function setCookie(name: string, value: string, days = 365): void {
  if (!isClient()) return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Delete a cookie by setting its expiry to the past.
 */
export function deleteCookie(name: string): void {
  if (!isClient()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

/**
 * Parse all cookies into a key-value record.
 * Returns an empty object on the server.
 */
export function parseCookies(): Record<string, string> {
  if (!isClient()) return {};
  const result: Record<string, string> = {};
  document.cookie.split(";").forEach((pair) => {
    const [rawKey, ...rest] = pair.split("=");
    const key = rawKey.trim();
    if (key) {
      result[key] = decodeURIComponent(rest.join("="));
    }
  });
  return result;
}
