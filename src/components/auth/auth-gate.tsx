"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService, type AuthUser } from "@/services/auth.service";

const AuthUserContext = createContext<AuthUser | null>(null);
export const useAuthenticatedUser = () => useContext(AuthUserContext);

type AuthChangeEvent = CustomEvent<{ reason?: "login" | "logout" }>;

export function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = pathname === "/" || pathname === "/login" || pathname === "/register";
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (isPublic) return;
    let active = true;
    let generation = 0;
    const check = async () => {
      const current = ++generation;
      try {
        const nextUser = await authService.currentUser();
        if (active && current === generation) {
          setUser(nextUser);
          setError("");
        }
      } catch (cause) {
        if (active && current === generation)
          setError(cause instanceof Error ? cause.message : "Unable to check your session.");
      }
    };
    const invalidate = () => {
      setUser(null);
      void check();
    };
    const signOut = () => {
      ++generation;
      setUser(null);
      setError("");
      router.replace("/login");
    };
    const unauthorized = () => signOut();
    const onAuthChange = (event: Event) => {
      if ((event as AuthChangeEvent).detail?.reason === "logout") {
        signOut();
        return;
      }
      invalidate();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "life-pilot-auth-event") return;

      try {
        if (JSON.parse(event.newValue ?? "{}").reason === "logout") {
          signOut();
          return;
        }
      } catch {
        // Legacy auth events are treated as a general session change.
      }
      invalidate();
    };
    void check();
    window.addEventListener("life-pilot:auth-changed", onAuthChange);
    window.addEventListener("life-pilot:unauthorized", unauthorized);
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      window.removeEventListener("life-pilot:auth-changed", onAuthChange);
      window.removeEventListener("life-pilot:unauthorized", unauthorized);
      window.removeEventListener("storage", onStorage);
    };
  }, [isPublic, router, attempt]);
  if (isPublic) return <AuthUserContext.Provider value={null}>{children}</AuthUserContext.Provider>;
  if (!user)
    return (
      <div className="grid min-h-dvh place-content-center gap-4 bg-slate-50 p-6" aria-busy={!error}>
        <p role={error ? "alert" : "status"}>{error || "Checking your session…"}</p>
        {error && (
          <button
            className="rounded bg-emerald-600 px-4 py-2 text-white"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try again
          </button>
        )}
      </div>
    );
  return <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>;
}
