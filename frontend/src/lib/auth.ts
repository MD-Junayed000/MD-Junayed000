const TOKEN_KEY = "portfolio_admin_token";
const AUTH_COOKIE_NAME = "portfolio_admin_auth";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  // Also set a cookie so the Next.js middleware can detect authentication.
  // This is NOT a security boundary (the real auth gate is the backend API),
  // but it provides basic redirect behavior for unauthenticated users.
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${60 * 60}; SameSite=Strict`;
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  // Clear the auth cookie
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
