import type { Metadata } from "next";
import Link from "next/link";
import { AuthSidePanel } from "@/components/auth/auth-side-panel";
import { LoginForm } from "@/components/auth/login-form";
import { OAuthOptions } from "@/components/auth/oauth-options";

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

              <LoginForm />

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
