"use client";

import { useCallback, useState } from "react";
import { authService, type LoginPayload, type RegisterPayload } from "@/services/auth.service";

export function useAuth() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const login = useCallback(async (payload: LoginPayload) => {
    setError("");
    setIsSubmitting(true);
    try {
      const session = await authService.login(payload);
      authService.saveSession(session);
      return session;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Login failed.";
      setError(message);
      throw cause;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setError("");
    setIsSubmitting(true);
    try {
      const session = await authService.register(payload);
      authService.saveSession(session);
      return session;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Registration failed.";
      setError(message);
      throw cause;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // A local logout must still succeed if an expired token is rejected by the API.
      authService.clearSession();
    }
  }, []);

  return { error, isSubmitting, login, logout, register };
}
