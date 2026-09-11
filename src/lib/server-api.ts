export const accessTokenCookie = "life-pilot-access";
export const refreshTokenCookie = "life-pilot-refresh";
export function backendUrl(path: string) {
  const base = (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://127.0.0.1:4000/api"
  ).replace(/\/$/, "");
  return `${base}/${path}`;
}
