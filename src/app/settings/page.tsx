"use client";

import { SettingsPanel } from "@/components/settings/settings-panel";
import { SectionHeader } from "@/components/ui/section-header";

export default function SettingsPage() {
  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Account"
        title="Account settings"
        description="Manage profile, password recovery, app preferences, and local backup."
      />
      <SettingsPanel />
    </div>
  );
}
