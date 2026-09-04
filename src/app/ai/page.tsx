"use client";

import { Bot } from "lucide-react";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Card } from "@/components/ui/card";
import { SelectInput } from "@/components/ui/field";
import { SectionHeader } from "@/components/ui/section-header";

export default function AiPage() {
  const { settings, updateSettings } = useLifeOs();

  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="AI Assistant"
        title="AI provider configuration"
        description="Choose how Life Pilot may use AI. No AI request is sent while this setting is off."
      />
      <Card title="Provider" eyebrow="Private by default" action={<Bot aria-hidden="true" className="size-5 text-emerald-600" />}>
        <div className="space-y-3">
          <label className="block space-y-2 text-sm font-semibold text-slate-700">
            AI mode
            <SelectInput
              onChange={(event) => updateSettings({ aiProvider: event.target.value as "off" | "free-api" | "local" })}
              value={settings.aiProvider}
            >
              <option value="off">Off — no AI requests</option>
              <option value="local">Local model</option>
              <option value="free-api">External provider</option>
            </SelectInput>
          </label>
          <p className="text-sm leading-6 text-slate-600">
            Provider credentials are not stored in the browser. Configure server-side credentials before enabling an external provider.
          </p>
        </div>
      </Card>
    </div>
  );
}
