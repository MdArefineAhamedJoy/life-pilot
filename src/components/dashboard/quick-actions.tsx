import Link from "next/link";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Add expense", href: "/expenses" },
  { label: "Scan slip", href: "/scan-slip" },
  { label: "Start timer", href: "/timer" },
  { label: "Add task", href: "/routine" },
  { label: "Add note", href: "/notes" },
  { label: "Export data", href: "/settings" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
      {actions.map((action, index) => (
        <Link
          className={cn(
            "inline-flex min-h-11 w-full items-center justify-center rounded-md px-4 py-2 text-center text-sm font-medium transition sm:min-h-10",
            index === 0
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-blue-500 text-white hover:bg-blue-600",
          )}
          href={action.href}
          key={action.href}
        >
          {action.label}
        </Link>
      ))}
    </div>
  );
}
