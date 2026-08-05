"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/", mark: "D" },
  { label: "Budget", href: "/budget", mark: "B" },
  { label: "Add Expense", href: "/add-expense", mark: "+" },
  { label: "Scan Slip", href: "/scan-slip", mark: "S" },
  { label: "Routine", href: "/routine", mark: "R" },
  { label: "Timer", href: "/timer", mark: "T" },
  { label: "Notes", href: "/notes", mark: "N" },
  { label: "Reports", href: "/reports", mark: "P" },
  { label: "Settings", href: "/settings", mark: "G" },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const primaryMobileItems = navItems.filter((item) =>
    ["/", "/add-expense", "/scan-slip", "/routine", "/timer"].includes(item.href),
  );

  return (
    <div className="min-h-dvh bg-[#f7f6f2] text-zinc-950">
      <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden min-h-screen border-r border-zinc-200 bg-white lg:block">
          <div className="sticky top-0 flex max-h-dvh min-h-dvh flex-col overflow-y-auto px-3 py-4 xl:px-4 xl:py-5">
            <Link className="rounded-md px-2 py-1" href="/">
              <p className="text-sm font-medium text-teal-700">Personal local-first planner</p>
              <h1 className="mt-1 text-xl font-semibold tracking-normal xl:text-2xl">Life Pilot</h1>
            </Link>
            <nav className="mt-6 space-y-1 xl:mt-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    className={cn(
                      "flex min-h-11 min-w-0 items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950",
                      isActive && "bg-zinc-950 text-white hover:bg-zinc-900 hover:text-white",
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded border border-zinc-200 bg-white text-xs font-semibold text-zinc-700",
                        isActive && "border-zinc-700 bg-zinc-800 text-white",
                      )}
                    >
                      {item.mark}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-semibold">Free first</p>
              <p className="mt-1 leading-5">Local browser data now. Optional AI/OCR later.</p>
            </div>
          </div>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur lg:hidden">
            <div className="px-3 py-3 sm:px-5 sm:py-4">
              <Link href="/">
                <p className="text-sm font-medium text-teal-700">Life Pilot</p>
                <h1 className="text-xl font-semibold">Daily planner</h1>
              </Link>
              <nav className="mt-3 flex snap-x gap-2 overflow-x-auto pb-1 sm:mt-4">
                {navItems.map((item) => (
                  <Link
                    className={cn(
                      "snap-start whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
                      pathname === item.href && "bg-zinc-950 text-white hover:bg-zinc-900 hover:text-white",
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto min-w-0 max-w-[1600px] px-3 py-4 pb-24 sm:px-5 sm:py-6 lg:px-6 lg:pb-8 xl:px-8">
            {children}
          </main>
        </div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-zinc-200 bg-white/95 px-2 py-2 shadow-[0_-8px_24px_rgba(24,24,27,0.08)] backdrop-blur sm:hidden">
        {primaryMobileItems.map((item) => (
          <Link
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium text-zinc-600",
              pathname === item.href && "bg-zinc-950 text-white",
            )}
            href={item.href}
            key={item.href}
          >
            <span className="text-sm font-semibold">{item.mark}</span>
            <span className="max-w-full truncate px-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
