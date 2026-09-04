"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  BellRing,
  CheckCircle2,
  ImageUp,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useLifeOs } from "@/components/state/life-os-provider";
import { useAccount } from "@/hooks/use-account";
import { ApiHealthStatus } from "@/components/settings/api-health-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldShell, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import type { LifeSettings } from "@/lib/types";

type ProfileDraft = Pick<
  LifeSettings,
  "profileName" | "profileEmail" | "profilePhone" | "profileLocation" | "profileRole" | "profileBio" | "profileImage"
>;

const fallbackProfile: ProfileDraft = {
  profileName: "",
  profileEmail: "",
  profilePhone: "",
  profileLocation: "",
  profileRole: "",
  profileBio: "",
  profileImage: "",
};

function createProfileDraft(settings: LifeSettings): ProfileDraft {
  return {
    profileName: settings.profileName ?? fallbackProfile.profileName,
    profileEmail: settings.profileEmail ?? fallbackProfile.profileEmail,
    profilePhone: settings.profilePhone ?? fallbackProfile.profilePhone,
    profileLocation: settings.profileLocation ?? fallbackProfile.profileLocation,
    profileRole: settings.profileRole ?? fallbackProfile.profileRole,
    profileBio: settings.profileBio ?? fallbackProfile.profileBio,
    profileImage: settings.profileImage ?? fallbackProfile.profileImage,
  };
}

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return initials || "LP";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SettingsPanel() {
  const {
    categories,
    expenses,
    notes,
    resetData,
    restoreData,
    settings,
    tasks,
    timerSessions,
    updateSettings,
  } = useLifeOs();
  const {
    isRequestingRecovery,
    isSavingProfile,
    requestPasswordRecovery: requestRemotePasswordRecovery,
    saveProfile: saveRemoteProfile,
  } = useAccount();
  const backupInputRef = useRef<HTMLInputElement | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement | null>(null);
  const [notificationStatus, setNotificationStatus] = useState(settings.notificationEnabled ? "granted" : "default");
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>(() => createProfileDraft(settings));
  const [profileMessage, setProfileMessage] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState(settings.profileEmail ?? fallbackProfile.profileEmail);
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [recoveryError, setRecoveryError] = useState("");

  const profileInitials = useMemo(() => getInitials(profileDraft.profileName), [profileDraft.profileName]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextProfile = createProfileDraft(settings);
      setProfileDraft(nextProfile);
      setRecoveryEmail(nextProfile.profileEmail);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [settings]);

  async function requestNotifications() {
    if (typeof Notification === "undefined") {
      setNotificationStatus("unsupported");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);
    updateSettings({ notificationEnabled: permission === "granted" });
  }

  function updateProfileField(field: keyof ProfileDraft, value: string) {
    setProfileDraft((current) => ({ ...current, [field]: value }));
    setProfileMessage("");
  }

  function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateProfileField("profileImage", typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextProfile = {
      ...profileDraft,
      profileName: profileDraft.profileName.trim(),
      profileEmail: profileDraft.profileEmail.trim(),
      profilePhone: profileDraft.profilePhone.trim(),
      profileLocation: profileDraft.profileLocation.trim(),
      profileRole: profileDraft.profileRole.trim(),
      profileBio: profileDraft.profileBio.trim(),
    };

    if (!nextProfile.profileName || !isValidEmail(nextProfile.profileEmail)) {
      setProfileMessage("Add a valid name and email before saving.");
      return;
    }

    try {
      await saveRemoteProfile({
        name: nextProfile.profileName,
        phone: nextProfile.profilePhone,
        location: nextProfile.profileLocation,
        role: nextProfile.profileRole,
        bio: nextProfile.profileBio,
        imageUrl: nextProfile.profileImage,
      });
      updateSettings(nextProfile);
      setProfileMessage("Profile updated.");
    } catch (cause) {
      setProfileMessage(cause instanceof Error ? cause.message : "Profile could not be updated.");
    }
  }

  async function requestPasswordRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = recoveryEmail.trim();

    setRecoveryError("");
    setRecoveryMessage("");

    if (!isValidEmail(trimmedEmail)) {
      setRecoveryError("Enter a valid email address.");
      return;
    }

    try {
      await requestRemotePasswordRecovery(trimmedEmail);
      setRecoveryMessage("If an account exists, password recovery instructions will be sent shortly.");
    } catch (cause) {
      setRecoveryError(cause instanceof Error ? cause.message : "Password recovery request failed.");
    }
  }

  function exportData() {
    const payload = JSON.stringify({ categories, expenses, tasks, timerSessions, notes, settings }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `life-pilot-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    restoreData(JSON.parse(text));
    event.target.value = "";
  }

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
      <div className="min-w-0 space-y-5">
        <Card title="Profile" eyebrow="Account" action={<Badge tone="teal">Local profile</Badge>}>
          <form className="space-y-5" onSubmit={saveProfile}>
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              <div className="flex shrink-0 flex-col items-center gap-3 md:w-44">
                <div className="relative">
                  {profileDraft.profileImage ? (
                    <button
                      aria-label="Change profile photo"
                      className="block size-28 overflow-hidden rounded-full border-4 border-white bg-slate-100 bg-cover bg-center shadow-md ring-1 ring-slate-200 transition hover:ring-[3px] hover:ring-emerald-600/25 sm:size-32"
                      onClick={() => profileImageInputRef.current?.click()}
                      style={{ backgroundImage: `url(${profileDraft.profileImage})` }}
                      type="button"
                    />
                  ) : (
                    <button
                      aria-label="Upload profile photo"
                      className="grid size-28 place-items-center rounded-full border border-dashed border-slate-300 bg-slate-50 text-2xl font-semibold text-slate-500 shadow-sm ring-4 ring-slate-100 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 sm:size-32"
                      onClick={() => profileImageInputRef.current?.click()}
                      type="button"
                    >
                      {profileInitials}
                    </button>
                  )}
                  <button
                    aria-label="Upload profile photo"
                    className="absolute bottom-1 right-1 grid size-9 place-items-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700"
                    onClick={() => profileImageInputRef.current?.click()}
                    title="Upload photo"
                    type="button"
                  >
                    <ImageUp aria-hidden="true" className="size-4" strokeWidth={2} />
                  </button>
                </div>
                <input
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                  ref={profileImageInputRef}
                  type="file"
                />
                <div className="flex w-full gap-2">
                  <Button
                    className="min-w-0 flex-1 px-3"
                    icon={<ImageUp aria-hidden="true" className="size-4" />}
                    onClick={() => profileImageInputRef.current?.click()}
                    type="button"
                    variant="outline"
                  >
                    Upload
                  </Button>
                  <Button
                    aria-label="Remove profile photo"
                    className="px-3"
                    disabled={!profileDraft.profileImage}
                    icon={<Trash2 aria-hidden="true" className="size-4" />}
                    onClick={() => updateProfileField("profileImage", "")}
                    type="button"
                    variant="outline"
                  />
                </div>
              </div>

              <div className="grid min-w-0 flex-1 gap-4 md:grid-cols-2">
                <FieldShell label="Full name">
                  <span className="relative block">
                    <UserRound
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                    />
                    <TextInput
                      className="pl-10"
                      onChange={(event) => updateProfileField("profileName", event.target.value)}
                      placeholder="Your name"
                      value={profileDraft.profileName}
                    />
                  </span>
                </FieldShell>
                <FieldShell label="Email address">
                  <span className="relative block">
                    <Mail
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                    />
                    <TextInput
                      className="pl-10"
                      onChange={(event) => updateProfileField("profileEmail", event.target.value)}
                      placeholder="you@example.com"
                      type="email"
                      value={profileDraft.profileEmail}
                    />
                  </span>
                </FieldShell>
                <FieldShell label="Phone number">
                  <span className="relative block">
                    <Phone
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                    />
                    <TextInput
                      className="pl-10"
                      onChange={(event) => updateProfileField("profilePhone", event.target.value)}
                      placeholder="+880 1XXX XXXXXX"
                      type="tel"
                      value={profileDraft.profilePhone}
                    />
                  </span>
                </FieldShell>
                <FieldShell label="Location">
                  <span className="relative block">
                    <MapPin
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                    />
                    <TextInput
                      className="pl-10"
                      onChange={(event) => updateProfileField("profileLocation", event.target.value)}
                      placeholder="City, country"
                      value={profileDraft.profileLocation}
                    />
                  </span>
                </FieldShell>
                <FieldShell label="Account type">
                  <TextInput
                    onChange={(event) => updateProfileField("profileRole", event.target.value)}
                    placeholder="Personal Life OS owner"
                    value={profileDraft.profileRole}
                  />
                </FieldShell>
                <div className="md:col-span-2">
                  <FieldShell label="Bio">
                    <TextArea
                      className="min-h-24"
                      onChange={(event) => updateProfileField("profileBio", event.target.value)}
                      placeholder="Short profile note"
                      value={profileDraft.profileBio}
                    />
                  </FieldShell>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-h-5 text-sm font-medium text-slate-600">{profileMessage}</p>
              <Button
                className="w-full sm:w-auto"
                disabled={isSavingProfile}
                icon={<Save aria-hidden="true" className="size-4" />}
                type="submit"
              >
                {isSavingProfile ? "Saving..." : "Save profile"}
              </Button>
            </div>
          </form>
        </Card>

        <Card title="Preferences" eyebrow="App">
          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <FieldShell label="Currency">
              <SelectInput
                onChange={(event) => updateSettings({ currency: event.target.value })}
                value={settings.currency}
              >
                <option value="BDT">BDT</option>
                <option value="USD">USD</option>
              </SelectInput>
            </FieldShell>
            <FieldShell label="AI mode">
              <SelectInput
                onChange={(event) =>
                  updateSettings({ aiProvider: event.target.value as "off" | "free-api" | "local" })
                }
                value={settings.aiProvider}
              >
                <option value="off">Off</option>
                <option value="free-api">Free API key later</option>
                <option value="local">Local model later</option>
              </SelectInput>
            </FieldShell>
            <FieldShell label="Quiet hours start">
              <TextInput
                onChange={(event) => updateSettings({ quietHoursStart: event.target.value })}
                type="time"
                value={settings.quietHoursStart}
              />
            </FieldShell>
            <FieldShell label="Quiet hours end">
              <TextInput
                onChange={(event) => updateSettings({ quietHoursEnd: event.target.value })}
                type="time"
                value={settings.quietHoursEnd}
              />
            </FieldShell>
          </div>
        </Card>
      </div>

      <div className="min-w-0 space-y-5">
        <ApiHealthStatus />
        <Card title="Password Recovery" eyebrow="Security" action={<ShieldCheck className="size-5 text-emerald-600" />}>
          <form className="space-y-4" onSubmit={requestPasswordRecovery}>
            <FieldShell label="Recovery email">
              <span className="relative block">
                <Mail
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                />
                <TextInput
                  className="pl-10"
                  onChange={(event) => {
                    setRecoveryEmail(event.target.value);
                    setRecoveryError("");
                    setRecoveryMessage("");
                  }}
                  placeholder="you@example.com"
                  type="email"
                  value={recoveryEmail}
                />
              </span>
            </FieldShell>
            <Button
              className="w-full"
              disabled={isRequestingRecovery}
              icon={<KeyRound aria-hidden="true" className="size-4" />}
              type="submit"
              variant="secondary"
            >
              {isRequestingRecovery ? "Sending..." : "Send reset link"}
            </Button>
            {recoveryError ? <p className="text-sm font-medium text-red-600">{recoveryError}</p> : null}
            {recoveryMessage ? (
              <p className="flex items-start gap-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span>{recoveryMessage}</span>
              </p>
            ) : null}
          </form>
        </Card>

        <Card title="Notifications And Data" eyebrow="Local first">
          <div className="space-y-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600">
                  <BellRing aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">Browser notifications</p>
                  <p className="mt-1 text-sm text-slate-600">Current status: {notificationStatus}</p>
                </div>
              </div>
              <Button className="mt-3 w-full" onClick={requestNotifications} type="button" variant="outline">
                Enable notifications
              </Button>
            </div>
            <div className="grid gap-3">
              <Button className="w-full" onClick={exportData} type="button">
                Export JSON
              </Button>
              <Button className="w-full" onClick={() => backupInputRef.current?.click()} type="button" variant="outline">
                Import JSON
              </Button>
              <Button className="w-full" onClick={resetData} type="button" variant="danger">
                Reset all data
              </Button>
            </div>
            <input
              accept="application/json"
              className="hidden"
              onChange={importData}
              ref={backupInputRef}
              type="file"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
