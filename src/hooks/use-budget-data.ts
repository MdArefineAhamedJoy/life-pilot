"use client";

import { useCallback, useEffect, useState } from "react";
import { budgetService } from "@/services/budget.service";
import type { BudgetSummary, BudgetUsage } from "@/types/budget.types";

/** Shared API-backed budget read model for dashboard-style pages. */
export function useBudgetData() {
  const [budgets, setBudgets] = useState<BudgetUsage[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((current) => current + 1), []);

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const [listResponse, summaryResponse] = await Promise.all([
          budgetService.list({ page: 1, limit: 100 }),
          budgetService.getSummary({}),
        ]);
        if (!active) return;
        setBudgets(listResponse.data);
        setSummary(summaryResponse.data);
      } catch (cause) {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Failed to load budget data.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [version]);

  return { budgets, summary, error, isLoading, refresh };
}
