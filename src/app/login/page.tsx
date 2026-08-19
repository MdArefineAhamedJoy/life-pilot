import type { Metadata } from "next";
import Link from "next/link";
import { AuthSidePanel } from "@/components/auth/auth-side-panel";
import { OAuthOptions } from "@/components/auth/oauth-options";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | Life Pilot AI",
  description: "Login to your Life Pilot AI workspace.",
};

export default function LoginPage() {
  return (
    <main className="h-dvh overflow-hidden bg-slate-50 text-slate-900">
      <div className="grid h-full lg:grid-cols-[0.92fr_1.08fr]">
        <section className="flex min-h-0 min-w-0 items-center justify-center px-4 py-4 sm:px-6">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm font-semibold text-emerald-700">
                Welcome back
              </p>
              <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Login to your account
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Open your budget, routine, tasks, and AI planning workspace.
              </p>

              <div className="mt-5 space-y-3">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-900">
                    Email address
                  </span>
                  <span className="relative block">
                    <Mail
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                      strokeWidth={2}
                    />
                    <input
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20"
                      name="email"
                      placeholder="you@example.com"
                      required
                      type="email"
                    />
                  </span>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-900">
                    Password
                  </span>
                  <span className="relative block">
                    <LockKeyhole
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                      strokeWidth={2}
                    />
                    <input
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20"
                      name="password"
                      placeholder="Enter your password"
                      required
                      type="password"
                    />
                  </span>
                </label>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex min-w-0 items-center gap-2 text-slate-600">
                    <input
                      className="size-4 rounded border-slate-300 text-emerald-600"
                      name="remember"
                      type="checkbox"
                    />
                    <span className="truncate">Remember me</span>
                  </label>
                  <Link
                    className="shrink-0 font-semibold text-emerald-700 hover:text-emerald-800"
                    href="/login"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Link
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  href="/dashboard"
                >
                  Login
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={2}
                  />
                </Link>
              </div>

              <OAuthOptions intent="login" />

              <p className="mt-3 text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                  href="/register"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </section>

        <AuthSidePanel />
      </div>
    </main>
  );
}
