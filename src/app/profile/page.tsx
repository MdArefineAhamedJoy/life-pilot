import { FeaturePage } from "@/components/life/feature-page";

export default function ProfilePage() {
  return (
    <FeaturePage
      eyebrow="Profile"
      title="Personal profile"
      description="Keep avatar, name, theme, currency, language, and notification preferences in one place."
      primaryAction="Update Profile"
      metrics={[
        { label: "Currency", value: "BDT", detail: "Default money format", tone: "primary" },
        { label: "Theme", value: "Light", detail: "Modern green dashboard", tone: "success" },
      ]}
      panels={[
        { title: "Profile Fields", eyebrow: "Account", items: ["Avatar", "Name", "Language", "Currency"], tone: "primary" },
        { title: "Preferences", eyebrow: "App", items: ["Theme", "Notification", "Privacy"], tone: "secondary" },
      ]}
    />
  );
}
