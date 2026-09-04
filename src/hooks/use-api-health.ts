"use client";

import { useEffect, useState } from "react";
import { healthService, type HealthStatus } from "@/services/health.service";

export function useApiHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    void healthService.get()
      .then((response) => isMounted && setHealth(response))
      .catch(() => isMounted && setHealth(null))
      .finally(() => isMounted && setIsLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  return { health, isLoading };
}
