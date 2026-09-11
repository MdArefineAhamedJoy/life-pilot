"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export function LandingAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function redirectAuthenticatedUser() {
      try {
        await authService.currentUser({ suppressToast: true, suppressUnauthorized: true });
        if (active) {
          router.replace("/dashboard");
          router.refresh();
        }
      } catch {
        // The landing page remains public when there is no valid saved session.
      }
    }

    void redirectAuthenticatedUser();
    return () => {
      active = false;
    };
  }, [router]);

  return null;
}
