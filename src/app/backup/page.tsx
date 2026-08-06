import { FeaturePage } from "@/components/life/feature-page";

export default function BackupPage() {
  return (
    <FeaturePage
      eyebrow="Backup"
      title="Export and restore data"
      description="Keep personal data portable with JSON/CSV export, restore, and future cloud sync."
      primaryAction="Export JSON"
      secondaryAction="Restore"
      metrics={[
        { label: "Storage", value: "Local", detail: "Browser-first MVP", tone: "success" },
        { label: "Cloud Sync", value: "Future", detail: "Optional later", tone: "neutral" },
      ]}
      panels={[
        { title: "Backup Actions", eyebrow: "Data", items: ["Export CSV", "Export JSON", "Restore", "Download"], tone: "primary" },
        { title: "Future Backup", eyebrow: "Later", items: ["Cloud Sync", "Backup Reminder", "Device Privacy Lock"], tone: "secondary" },
      ]}
    />
  );
}
