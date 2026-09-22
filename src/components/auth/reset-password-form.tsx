"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Input } from "@/components/ui/input";
import { accountService } from "@/services/account.service";

type ResetPasswordFormProps = { token: string };

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  async function handleSubmit() {
    if (!token) {
      setError("This password reset link is invalid. Request a new link from the login page.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Password confirmation does not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await accountService.resetPassword(token, password, passwordConfirmation);
      setIsComplete(true);
      window.setTimeout(() => router.replace("/login"), 1800);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Password reset failed. Please request a new link."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const passwordToggle = (visible: boolean, label: string, onClick: () => void) => (
    <button
      aria-label={`${visible ? "Hide" : "Show"} ${label}`}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      onClick={onClick}
      type="button"
    >
      {visible ? (
        <EyeOff aria-hidden="true" className="size-4" />
      ) : (
        <Eye aria-hidden="true" className="size-4" />
      )}
    </button>
  );

  return (
    <main className="grid min-h-dvh place-items-center bg-slate-50 p-4 text-slate-900 sm:p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold text-emerald-700">Account recovery</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950">
          Set a new password
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Choose a new password with at least eight characters. This will sign out other sessions.
        </p>

        {isComplete ? (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            Password updated. Redirecting you to login…
          </div>
        ) : (
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit();
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-900">New password</span>
              <span className="relative block">
                <LockKeyhole
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                />
                <Input
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-950 shadow-sm"
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                {passwordToggle(showPassword, "password", () =>
                  setShowPassword((visible) => !visible)
                )}
              </span>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-900">Confirm new password</span>
              <span className="relative block">
                <Input
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-950 shadow-sm"
                  minLength={8}
                  onChange={(event) => setPasswordConfirmation(event.target.value)}
                  required
                  type={showPasswordConfirmation ? "text" : "password"}
                  value={passwordConfirmation}
                />
                {passwordToggle(showPasswordConfirmation, "password confirmation", () =>
                  setShowPasswordConfirmation((visible) => !visible)
                )}
              </span>
            </label>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={isSubmitting || !token || !password || !passwordConfirmation}
              type="submit"
            >
              {isSubmitting ? "Updating password…" : "Update password"}
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-slate-600">
          <Link className="font-semibold text-emerald-700 hover:text-emerald-800" href="/login">
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
}
