"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { authService } from "@/services/auth.service";
import { navItems } from "./landing-data";
import { PrimaryLink } from "./landing-primitives";

export function LandingNav() {
  const router = useRouter();

  useEffect(() => {
    async function redirectSavedSession() {
      try {
        await authService.currentUser({ suppressToast: true, suppressUnauthorized: true });
        router.push("/dashboard");
      } catch {
        // Landing remains public when no saved session exists.
      }
    }

    void redirectSavedSession();
  }, [router]);

  return (
    <nav className="life-nav fixed left-0 right-0 top-0 z-50 border-b border-[var(--life-border)] bg-[color-mix(in_srgb,var(--life-bg)_86%,transparent)] backdrop-blur-2xl">
      <div className="mx-auto flex min-h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          className="flex min-w-0 items-center gap-3 rounded-md text-[var(--life-text)]"
          href="/"
        >
          <span className="life-brand-logo grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white">
            AI
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold uppercase tracking-[0.14em] text-[var(--life-accent)]">
              Life Pilot
            </span>
            <span className="block truncate text-base font-semibold">AI Planner</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              className="rounded-full px-3 py-2 text-sm font-medium text-[var(--life-muted)] transition hover:bg-[var(--life-accent-soft)] hover:text-[var(--life-text)]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[var(--life-text)] transition hover:text-[var(--life-accent)] sm:inline-flex"
            href="/login"
          >
            Login
          </Link>
          <PrimaryLink href="/register">
            Start
            <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
          </PrimaryLink>
        </div>
      </div>
    </nav>
  );
}
