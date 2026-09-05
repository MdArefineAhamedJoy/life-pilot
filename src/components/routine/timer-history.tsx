"use client";

import { useLifeOs } from "@/components/state/life-os-provider";
import { DataTable, type TableColumn } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import type { TimerSession } from "@/lib/types";

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export function TimerHistory() {
  const { timerSessions } = useLifeOs();
  const columns: TableColumn<TimerSession>[] = [
    { key: "title", header: "Session", render: (session) => session.title },
    { key: "category", header: "Category", render: (session) => <Badge>{session.category}</Badge> },
    { key: "mode", header: "Mode", render: (session) => session.mode },
    {
      key: "duration",
      header: "Duration",
      align: "right",
      render: (session) => <span className="font-mono">{formatDuration(session.durationSeconds)}</span>,
    },
  ];

  return (
    <section className="min-w-0">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-normal text-emerald-600">History</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-800">Saved Timer Sessions</h2>
      </div>
      <DataTable columns={columns} emptyMessage="No timer session saved yet." getRowKey={(session) => session.id} rows={timerSessions} />
    </section>
  );
}
