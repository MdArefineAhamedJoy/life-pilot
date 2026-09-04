"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bot,
  CalendarDays,
  ChartColumn,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ListChecks,
  ListTodo,
  LogOut,
  NotebookTabs,
  ScanLine,
  Settings,
  StickyNote,
  Timer,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useLifeOs } from "@/components/state/life-os-provider";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  accent: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, accent: "bg-emerald-500" },
  { label: "Budget", href: "/budget", icon: WalletCards, accent: "bg-blue-500" },
  { label: "Expenses", href: "/expenses", icon: NotebookTabs, accent: "bg-red-500" },
  { label: "Receipt Scanner", href: "/receipt-scanner", icon: ScanLine, accent: "bg-blue-500" },
  { label: "Categories", href: "/categories", icon: ChartColumn, accent: "bg-emerald-500" },
  { label: "Routine", href: "/routine", icon: ListChecks, accent: "bg-amber-500" },
  { label: "Tasks", href: "/tasks", icon: ListTodo, accent: "bg-blue-500" },
  { label: "Timer", href: "/timer", icon: Timer, accent: "bg-blue-500" },
  { label: "Notes", href: "/notes", icon: StickyNote, accent: "bg-green-500" },
  { label: "AI Assistant", href: "/ai", icon: Bot, accent: "bg-slate-800" },
  { label: "Calendar", href: "/calendar", icon: CalendarDays, accent: "bg-emerald-500" },
];

type AppShellProps = {
  children: ReactNode;
};

const publicRoutes = new Set(["/", "/login", "/register"]);

function NavIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon aria-hidden="true" className="size-4" strokeWidth={1.9} />;
}

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function getAccountInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return initials || "LP";
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useLifeOs();
  const { logout } = useAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const accountName = settings.profileName || "Life Pilot user";
  const accountEmail = settings.profileEmail || "No profile email";

  async function handleLogout() {
    await logout();
    setIsAccountMenuOpen(false);
    router.replace("/login");
  }

  if (publicRoutes.has(pathname)) {
    return <>{children}</>;
  }

  const primaryMobileItems = navItems.filter((item) =>
    ["/dashboard", "/budget", "/expenses", "/routine", "/timer"].includes(item.href),
  );

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800">
      <div
        className={cn(
          "lg:grid lg:transition-[grid-template-columns] lg:duration-200 lg:ease-out",
          isSidebarCollapsed ? "lg:grid-cols-[88px_minmax(0,1fr)]" : "lg:grid-cols-[272px_minmax(0,1fr)]",
        )}
      >
        <aside className="hidden min-h-screen border-r border-slate-200 bg-white lg:block">
          <div
            className={cn(
              "sticky top-0 flex h-dvh min-h-dvh flex-col transition-[padding] duration-200 ease-out",
              isSidebarCollapsed ? "px-3" : "px-4 xl:px-5",
            )}
          >
            <div
              className={cn(
                "shrink-0 border-b border-slate-200 bg-white transition-[margin,padding] duration-200 ease-out",
                isSidebarCollapsed ? "-mx-3 px-3 py-4" : "-mx-4 px-4 py-5 xl:-mx-5 xl:px-5",
              )}
            >
              <div
                className={cn(
                  "flex items-center",
                  isSidebarCollapsed ? "justify-center" : "gap-3",
                )}
              >
                <Link
                  aria-label="Life Pilot dashboard"
                  className={cn(
                    "flex min-w-0 items-center rounded-md py-1",
                    isSidebarCollapsed ? "justify-center px-0" : "flex-1 gap-3 px-2",
                  )}
                  href="/dashboard"
                >
                  <span className="flex size-11 items-center justify-center rounded-md bg-emerald-500 text-sm font-semibold text-white shadow-sm">
                    LP
                  </span>
                  <span className={cn("min-w-0", isSidebarCollapsed && "sr-only")}>
                    <span className="block truncate text-xs font-medium text-emerald-600">
                      Personal local-first planner
                    </span>
                    <span className="block truncate text-xl font-semibold tracking-normal text-slate-800">
                      Life Pilot
                    </span>
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative h-0 shrink-0">
              <button
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="absolute right-[-25px] top-[-14px] z-10 flex size-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                onClick={() => {
                  setIsAccountMenuOpen(false);
                  setIsSidebarCollapsed((current) => !current);
                }}
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                type="button"
              >
                {isSidebarCollapsed ? (
                  <ChevronsRight aria-hidden="true" className="size-4" strokeWidth={2} />
                ) : (
                  <ChevronsLeft aria-hidden="true" className="size-4" strokeWidth={2} />
                )}
              </button>
            </div>

            <div
              className={cn(
                "sidebar-scrollbar min-h-0 flex-1 overflow-y-auto pb-4 transition-[margin,padding] duration-200 ease-out",
                isSidebarCollapsed ? "-mx-3 px-3" : "-mx-4 pl-4 pr-1 xl:-mx-5 xl:pl-5",
              )}
            >
              <nav
                className={cn("mt-2 space-y-1 xl:mt-3", !isSidebarCollapsed && "mr-3")}
                aria-label="Main navigation"
              >
                {navItems.map((item) => {
                  const isActive = isActivePath(pathname, item.href);

                  return (
                    <Link
                      aria-label={isSidebarCollapsed ? item.label : undefined}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative flex min-h-12 min-w-0 items-center rounded-xl text-base font-medium transition",
                        isSidebarCollapsed ? "justify-center px-0" : "gap-4 px-3",
                        isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800",
                      )}
                      href={item.href}
                      key={item.href}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center text-current transition">
                        <NavIcon icon={item.icon} />
                      </span>
                      <span className={cn("truncate", isSidebarCollapsed && "sr-only")}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div
              className={cn(
                "relative shrink-0 border-t border-slate-200 bg-white transition-[margin,padding] duration-200 ease-out",
                isSidebarCollapsed ? "-mx-3 px-3 py-2" : "-mx-4 px-4 py-0 xl:-mx-5 xl:px-5",
              )}
            >
              {isAccountMenuOpen && (
                <div
                  className={cn(
                    "absolute bottom-[calc(100%+8px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.14)]",
                    isSidebarCollapsed ? "left-3 w-60" : "inset-x-4 xl:inset-x-5",
                  )}
                >
                  <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800">
                    My Account
                  </div>
                  <Link
                    className="flex min-h-11 items-center gap-3 border-b border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
                    href="/settings"
                    onClick={handleLogout}
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
                aria-label={isAccountMenuOpen ? "Close account menu" : "Open account menu"}
                className={cn(
                  "flex w-full min-w-0 items-center bg-white py-2 text-left transition hover:bg-slate-50",
                  isSidebarCollapsed ? "min-h-12 justify-center rounded-md px-0" : "min-h-16 gap-3 px-2",
                )}
                onClick={(event) => {
                  event.preventDefault();
                  setIsAccountMenuOpen((current) => !current);
                }}
                title={isSidebarCollapsed ? "My Account" : undefined}
                type="button"
              >
                {settings.profileImage ? (
                  <span
                    className="size-12 shrink-0 rounded-full bg-slate-100 bg-cover bg-center shadow-sm ring-1 ring-slate-200"
                    style={{ backgroundImage: `url(${settings.profileImage})` }}
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className="profile-avatar flex shrink-0 items-center justify-center text-xs font-semibold text-white"
                    aria-hidden="true"
                  >
                    {getAccountInitials(accountName)}
                  </span>
                )}
                <span className={cn("min-w-0 flex-1", isSidebarCollapsed && "sr-only")}>
                  <span className="block truncate text-sm font-semibold leading-5 text-slate-950">
                    {accountName}
                  </span>
                  <span className="block truncate text-xs font-semibold leading-4 text-slate-500">
                    {accountEmail}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
            <div className="px-3 py-3 sm:px-5 sm:py-4">
              <Link href="/dashboard">
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
