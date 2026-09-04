"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, isSubmitting, login } = useAuth();

  async function handleLogin() {
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch {
      // The reusable auth hook exposes the error state to the form.
    }
  }

  return (
    <div className="mt-5 space-y-3">
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

      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex min-w-0 items-center gap-2 text-slate-600">
          <input className="size-4 rounded border-slate-300 text-emerald-600" name="remember" type="checkbox" />
          <span className="truncate">Remember me</span>
        </label>
        <Link className="shrink-0 font-semibold text-emerald-700 hover:text-emerald-800" href="/login">
          Forgot password?
        </Link>
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <button
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={isSubmitting || !email || !password}
        onClick={handleLogin}
        type="button"
      >
        {isSubmitting ? "Logging in..." : "Login"}
        <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}
