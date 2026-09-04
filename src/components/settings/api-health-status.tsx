"use client";

import { Activity } from "lucide-react";
import { useApiHealth } from "@/hooks/use-api-health";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function ApiHealthStatus() {
  const { health, isLoading } = useApiHealth();
  const isOnline = Boolean(health);

  return (
    <Card
      title="API connection"
      eyebrow="System"
      action={<Activity aria-hidden="true" className={isOnline ? "size-5 text-emerald-600" : "size-5 text-slate-400"} />}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {isLoading ? "Checking the Life OS API…" : isOnline ? "The Life OS API is reachable." : "The Life OS API is unavailable."}
        </p>
        <Badge tone={isOnline ? "success" : "warning"}>{isLoading ? "Checking" : isOnline ? "Online" : "Offline"}</Badge>
      </div>
    </Card>
  );
}
