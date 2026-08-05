"use client";

import { SettingsPanel } from "@/components/settings/settings-panel";
import { SectionHeader } from "@/components/ui/section-header";

export default function SettingsPage() {
  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Settings"
        title="Local data and app settings"
        description="Configure currency, notifications, quiet hours, AI mode, export, import, and reset."
      />
      <SettingsPanel />
    </div>
  );
}
