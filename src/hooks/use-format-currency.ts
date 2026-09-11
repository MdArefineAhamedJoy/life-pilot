"use client";
import { useCallback } from "react";
import { useLifeOs } from "@/components/state/life-os-provider";
import { formatCurrency } from "@/lib/utils";

export function useFormatCurrency() {
  const { settings } = useLifeOs();
  return useCallback(
    (amount: number) => formatCurrency(amount, settings.currency),
    [settings.currency]
  );
}
