import axios, { AxiosError } from "axios";
export const apiClient = axios.create({
  baseURL: "/api", timeout: 20000, headers: { "Content-Type": "application/json" },
});
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    const publicRequest = ["/auth/login", "/auth/register", "/account/password-recovery"].includes(error.config?.url ?? "");
    if (error.response?.status === 401 && !publicRequest && typeof window !== "undefined") {
      window.dispatchEvent(new Event("life-pilot:unauthorized"));
    }
    const message = error.response?.data?.message;
    const detail = Array.isArray(message) ? message.join(", ") : message;
    return Promise.reject(new Error(detail || error.message || "The request failed. Please try again."));
  },
);
