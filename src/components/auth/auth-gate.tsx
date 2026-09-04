"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

const publicRoutes = new Set(["/", "/login", "/register"]);

export function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicRoute = publicRoutes.has(pathname);
  const [isAuthorized, setIsAuthorized] = useState(isPublicRoute);

  useEffect(() => {
    if (isPublicRoute) {
      return;
    }

    let isMounted = true;
    const session = authService.getSession();
    if (!session?.token) {
      router.replace("/login");
      return;
    }

    void authService.currentUser()
      .then(() => {
        if (isMounted) setIsAuthorized(true);
      })
      .catch(() => {
        authService.clearSession();
        router.replace("/login");
      });

    const onUnauthorized = () => router.replace("/login");
    window.addEventListener("life-pilot:unauthorized", onUnauthorized);
    return () => {
      isMounted = false;
      window.removeEventListener("life-pilot:unauthorized", onUnauthorized);
    };
  }, [isPublicRoute, router]);

  if (isPublicRoute || isAuthorized) return <>{children}</>;

  return <div className="min-h-dvh bg-slate-50" aria-busy="true" />;
}
