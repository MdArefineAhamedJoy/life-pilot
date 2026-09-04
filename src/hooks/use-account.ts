"use client";

import { useCallback, useState } from "react";
import { accountService, type ProfilePayload } from "@/services/account.service";

export function useAccount() {
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isRequestingRecovery, setIsRequestingRecovery] = useState(false);

  const saveProfile = useCallback(async (payload: ProfilePayload) => {
    setIsSavingProfile(true);
    try {
      return await accountService.saveProfile(payload);
    } finally {
      setIsSavingProfile(false);
    }
  }, []);

  const requestPasswordRecovery = useCallback(async (email: string) => {
    setIsRequestingRecovery(true);
    try {
      return await accountService.requestPasswordRecovery(email);
    } finally {
      setIsRequestingRecovery(false);
    }
  }, []);

  return { isRequestingRecovery, isSavingProfile, requestPasswordRecovery, saveProfile };
}
