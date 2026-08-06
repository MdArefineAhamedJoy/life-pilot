"use client";

import { useRef, useState } from "react";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldShell, SelectInput, TextInput } from "@/components/ui/field";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [notificationStatus, setNotificationStatus] = useState(settings.notificationEnabled ? "granted" : "default");

  async function requestNotifications() {
    if (typeof Notification === "undefined") {
      setNotificationStatus("unsupported");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);
    updateSettings({ notificationEnabled: permission === "granted" });
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

  async function importData(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    restoreData(JSON.parse(text));
    event.target.value = "";
  }

  return (
    <div className="grid min-w-0 gap-5 2xl:grid-cols-[1fr_1fr]">
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
      <Card title="Notifications And Data" eyebrow="Local first">
        <div className="space-y-4">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">Browser notifications</p>
            <p className="mt-1 text-sm text-slate-600">Current status: {notificationStatus}</p>
            <Button className="mt-3" onClick={requestNotifications} type="button" variant="secondary">
              Enable notifications
            </Button>
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <Button className="w-full sm:w-auto" onClick={exportData} type="button">Export JSON</Button>
            <Button className="w-full sm:w-auto" onClick={() => fileInputRef.current?.click()} type="button" variant="secondary">
              Import JSON
            </Button>
            <Button className="w-full sm:w-auto" onClick={resetData} type="button" variant="danger">
              Reset demo data
            </Button>
          </div>
          <input
            accept="application/json"
            className="hidden"
            onChange={importData}
            ref={fileInputRef}
            type="file"
          />
        </div>
      </Card>
    </div>
  );
}
