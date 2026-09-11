"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { accountService } from "@/services/account.service";
import { useAuth } from "@/hooks/use-auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [requestingRecovery, setRequestingRecovery] = useState(false);
  const { error, isSubmitting, login } = useAuth();

  async function handleLogin() {
    try {
      await login({ email, password });
      const next = new URLSearchParams(window.location.search).get("next");
      const destination =
        next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\")
          ? next
          : "/dashboard";
      router.replace(destination);
      router.refresh();
    } catch {
      // The reusable auth hook exposes the error state to the form.
    }
  }

  return (
    <form
      className="mt-5 space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        void handleLogin();
      }}
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-900">Email address</span>
        <span className="relative block">
          <Mail
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            strokeWidth={2}
          />
          <input
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </span>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-900">Password</span>
        <span className="relative block">
          <LockKeyhole
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            strokeWidth={2}
          />
          <input
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />
        </span>
      </label>

      <button
        type="button"
        disabled={!email || requestingRecovery}
        className="text-sm font-semibold text-emerald-700"
        onClick={async () => {
          setRequestingRecovery(true);
          try {
            await accountService.requestPasswordRecovery(email);
            setRecoveryMessage("Recovery instructions requested.");
          } catch (cause) {
            setRecoveryMessage(cause instanceof Error ? cause.message : "Recovery request failed.");
          } finally {
            setRequestingRecovery(false);
          }
        }}
      >
        {requestingRecovery ? "Requesting?" : "Forgot password?"}
      </button>
      {recoveryMessage && (
        <p role="status" className="text-sm text-slate-700">
          {recoveryMessage}
        </p>
      )}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <button
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={isSubmitting || !email || !password}
        type="submit"
      >
        {isSubmitting ? "Logging in..." : "Login"}
        <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
      </button>
    </form>
  );
}
