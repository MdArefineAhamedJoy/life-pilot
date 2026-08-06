"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  CalendarDays,
  ChartColumn,
  CirclePlus,
  DatabaseBackup,
  HeartPulse,
  LayoutDashboard,
  ListChecks,
  ListTodo,
  LogOut,
  NotebookTabs,
  ScanLine,
  Settings,
  ShoppingCart,
  StickyNote,
  Timer,
  Trophy,
  Users,
  Utensils,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  accent: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, accent: "bg-emerald-500" },
  { label: "Budget", href: "/budget", icon: WalletCards, accent: "bg-blue-500" },
  { label: "Expenses", href: "/expenses", icon: NotebookTabs, accent: "bg-red-500" },
  { label: "Add Expense", href: "/add-expense", icon: CirclePlus, accent: "bg-emerald-500" },
  { label: "Receipt Scanner", href: "/receipt-scanner", icon: ScanLine, accent: "bg-blue-500" },
  { label: "Categories", href: "/categories", icon: ChartColumn, accent: "bg-emerald-500" },
  { label: "Routine", href: "/routine", icon: ListChecks, accent: "bg-amber-500" },
  { label: "Tasks", href: "/tasks", icon: ListTodo, accent: "bg-blue-500" },
  { label: "Timer", href: "/timer", icon: Timer, accent: "bg-blue-500" },
  { label: "Notes", href: "/notes", icon: StickyNote, accent: "bg-green-500" },
  { label: "Goals", href: "/goals", icon: Trophy, accent: "bg-blue-500" },
  { label: "Shopping", href: "/shopping", icon: ShoppingCart, accent: "bg-amber-500" },
  { label: "Meal Planner", href: "/meal-planner", icon: Utensils, accent: "bg-emerald-500" },
  { label: "Health", href: "/health", icon: HeartPulse, accent: "bg-red-500" },
  { label: "Family", href: "/family", icon: Users, accent: "bg-blue-500" },
  { label: "Reminder", href: "/reminder", icon: Bell, accent: "bg-amber-500" },
  { label: "Reports", href: "/reports", icon: ChartColumn, accent: "bg-emerald-500" },
  { label: "AI Assistant", href: "/ai", icon: Bot, accent: "bg-slate-800" },
  { label: "Backup", href: "/backup", icon: DatabaseBackup, accent: "bg-blue-500" },
  { label: "Calendar", href: "/calendar", icon: CalendarDays, accent: "bg-emerald-500" },
];

type AppShellProps = {
  children: ReactNode;
};

function NavIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon aria-hidden="true" className="size-4" strokeWidth={1.9} />;
}

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const primaryMobileItems = navItems.filter((item) =>
    ["/", "/budget", "/add-expense", "/routine", "/timer"].includes(item.href),
  );

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800">
      <div className="lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="hidden min-h-screen border-r border-slate-200 bg-white lg:block">
          <div className="sticky top-0 flex h-dvh min-h-dvh flex-col px-4 xl:px-5">
            <div className="-mx-4 shrink-0 border-b border-slate-200 bg-white px-4 py-5 xl:-mx-5 xl:px-5">
              <Link className="flex items-center gap-3 rounded-md px-2 py-1" href="/">
                <span className="flex size-11 items-center justify-center rounded-md bg-emerald-500 text-sm font-semibold text-white shadow-sm">
                  LP
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-emerald-600">
                    Personal local-first planner
                  </span>
                  <span className="block truncate text-xl font-semibold tracking-normal text-slate-800">
                    Life Pilot
                  </span>
                </span>
              </Link>
            </div>

            <div className="sidebar-scrollbar -mx-4 min-h-0 flex-1 overflow-y-auto pb-4 pl-4 pr-1 xl:-mx-5 xl:pl-5">
              <nav className="mr-3 mt-2 space-y-1 xl:mt-3" aria-label="Main navigation">
                {navItems.map((item) => {
                  const isActive = isActivePath(pathname, item.href);

                  return (
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative flex min-h-12 min-w-0 items-center gap-4 rounded-xl px-3 text-base font-medium transition",
                        isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800",
                      )}
                      href={item.href}
                      key={item.href}
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center text-current transition">
                        <NavIcon icon={item.icon} />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="relative -mx-4 shrink-0 border-t border-slate-200 bg-white px-4 py-0 xl:-mx-5 xl:px-5">
              {isAccountMenuOpen && (
                <div className="absolute inset-x-4 bottom-[calc(100%+8px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.14)] xl:inset-x-5">
                  <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800">
                    My Account
                  </div>
                  <Link
                    className="flex min-h-11 items-center gap-3 border-b border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
                    href="/settings"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    <Settings aria-hidden="true" className="size-4" strokeWidth={1.9} />
                    Account Settings
                  </Link>
                  <button
                    className="flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                    onClick={() => setIsAccountMenuOpen(false)}
                    type="button"
                  >
                    <LogOut aria-hidden="true" className="size-4" strokeWidth={1.9} />
                    Logout
                  </button>
                </div>
              )}
                <button
                  aria-expanded={isAccountMenuOpen}
                  aria-label="Open account menu"
                  className="flex min-h-16 w-full min-w-0 items-center gap-3 bg-white px-2 py-2 text-left transition hover:bg-slate-50"
                  onClick={(event) => {
                    event.preventDefault();
                    setIsAccountMenuOpen((current) => !current);
                  }}
                  type="button"
                >
                  <span className="profile-avatar shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold leading-5 text-slate-950">
                      Md Arefine Ahamed Joy
                    </span>
                    <span className="block truncate text-xs font-semibold leading-4 text-slate-500">
                      mdarefine05@gmail.com
                    </span>
                  </span>
                </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
            <div className="px-3 py-3 sm:px-5 sm:py-4">
              <Link href="/">
                <p className="text-sm font-medium text-emerald-600">Life Pilot</p>
                <h1 className="text-xl font-semibold">Daily planner</h1>
              </Link>
              <nav className="mt-3 flex snap-x gap-2 overflow-x-auto pb-1 sm:mt-4" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <Link
                    aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "snap-start whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800",
                      isActivePath(pathname, item.href) &&
                        "bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white",
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

          <main className="mx-auto min-w-0 max-w-[1600px] p-6 pb-24 lg:pb-6">
            {children}
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-8px_24px_rgba(30,41,59,0.08)] backdrop-blur sm:hidden">
        {primaryMobileItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-13 min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium text-slate-600",
                isActive && "bg-emerald-500 text-white",
              )}
              href={item.href}
              key={item.href}
            >
              <span className="flex size-6 items-center justify-center">
                <NavIcon icon={item.icon} />
              </span>
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
