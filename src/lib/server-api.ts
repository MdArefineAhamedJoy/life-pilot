export const sessionCookie = "life-pilot-session";

const defaultApiBaseUrl = "https://life-pilot-be.vercel.app/api";

export function backendUrl(path: string) {
  const base = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || defaultApiBaseUrl).replace(/\/$/, "");
  return `${base}/${path}`;
}
