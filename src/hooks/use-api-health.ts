"use client";

import { useEffect, useState } from "react";
import { healthService, type HealthStatus } from "@/services/health.service";

export function useApiHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    void Promise.all([healthService.get(), healthService.database()])
      .then(
        ([api, database]) =>
          isMounted &&
          setHealth({
            ...api,
            status: api.status === "ok" && database.status === "ok" ? "ok" : "unavailable",
            database: database.status,
          })
      )
      .catch(() => isMounted && setHealth(null))
      .finally(() => isMounted && setIsLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  return { health, isLoading };
}
