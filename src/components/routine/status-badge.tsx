import type { RoutineStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const statusTone = {
  pending: "neutral",
  active: "indigo",
  completed: "success",
  skipped: "warning",
  delayed: "warning",
  missed: "danger",
} as const;

type StatusBadgeProps = {
  status: RoutineStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge tone={statusTone[status]}>{status}</Badge>;
}
