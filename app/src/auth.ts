export interface JwtPayload {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

export function saveToken(token: string | null) {
  if (typeof window === "undefined" || !token) return;
  localStorage.setItem("authToken", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
  localStorage.removeItem("authSearchHistory");
}

export function parseJwt(token?: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

export function getUser(): JwtPayload | null {
  const token = getToken();
  return parseJwt(token);
}

export function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("authSearchHistory") || "[]");
  } catch {
    return [];
  }
}

export function saveSearchQuery(query: string) {
  if (typeof window === "undefined") return;
  const trimmed = query.trim();
  if (!trimmed) return;
  const existing = getSearchHistory();
  const filtered = [trimmed, ...existing.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())];
  localStorage.setItem("authSearchHistory", JSON.stringify(filtered.slice(0, 6)));
}