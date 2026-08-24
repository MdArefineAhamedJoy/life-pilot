"use client";

import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RoutineNotificationToastProps = {
  hasNotification: boolean;
  message?: string;
  onDismiss: () => void;
  onOpen: () => void;
  open: boolean;
};

export function RoutineNotificationToast({
  hasNotification,
  message,
  onDismiss,
  onOpen,
  open,
}: RoutineNotificationToastProps) {
  return (
    <>
      <button
        aria-label="Show routine notification"
        className={cn(
          "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50",
          hasNotification && "border-amber-300 bg-amber-50 text-amber-700",
        )}
        onClick={onOpen}
        title="Routine notification"
        type="button"
      >
        <Bell className="h-4 w-4" />
        {hasNotification && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />}
      </button>

      {open && message && (
        <div className="fixed right-4 top-4 z-[70] w-[min(calc(100vw-2rem),360px)] rounded-lg border border-amber-200 bg-white p-3 text-sm text-slate-800 shadow-xl">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700">
              <Bell className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-950">Routine notification</p>
              <p className="mt-1 break-words text-slate-600">{message}</p>
            </div>
            <Button className="h-8 w-8 px-0" onClick={onDismiss} type="button" variant="ghost">
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss notification</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
