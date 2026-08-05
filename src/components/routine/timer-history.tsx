"use client";

import { useLifeOs } from "@/components/state/life-os-provider";
import { Card } from "@/components/ui/card";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
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
    { key: "category", header: "Category", render: (session) => session.category },
    { key: "mode", header: "Mode", render: (session) => session.mode },
    { key: "duration", header: "Duration", align: "right", render: (session) => formatDuration(session.durationSeconds) },
  ];

  return (
    <Card title="Saved Timer Sessions" eyebrow="History">
      <DataTable columns={columns} getRowKey={(session) => session.id} rows={timerSessions} />
    </Card>
  );
}
