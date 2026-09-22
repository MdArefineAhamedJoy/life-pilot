"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { accountService } from "@/services/account.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit() {
    setError("");
    setIsSubmitting(true);
    try {
      await accountService.requestPasswordRecovery(email.trim());
      setIsSent(true);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "We could not send password-reset instructions. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-slate-50 p-4 text-slate-900 sm:p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold text-emerald-700">Account recovery</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter the email address for your account. We&apos;ll send a one-time reset link.
        </p>

        {isSent ? (
          <div className="mt-5 space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
            <p className="font-semibold">Check your inbox</p>
            <p>
              If an account matches <strong>{email.trim()}</strong>, password-reset instructions
              have been sent. The link expires in one hour.
            </p>
            <button
              className="font-semibold text-emerald-800 underline underline-offset-2"
              onClick={() => setIsSent(false)}
              type="button"
            >
              Use a different email
            </button>
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
              <span className="text-sm font-medium text-slate-900">Email address</span>
              <span className="relative block">
                <Mail
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                />
                <Input
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </span>
            </label>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={isSubmitting || !email.trim()}
              type="submit"
            >
              {isSubmitting ? (
                <RefreshCw aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Mail aria-hidden="true" className="size-4" />
              )}
              {isSubmitting ? "Sending instructions..." : "Send reset link"}
              {!isSubmitting && <ArrowRight aria-hidden="true" className="size-4" />}
            </button>
          </form>
        )}

        <Link
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          href="/login"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to login
        </Link>
      </section>
    </main>
  );
}
