"use client";

import { NotesManager } from "@/components/life/notes-manager";
import { PersonalDatabase } from "@/components/life/personal-database";
import { useLifeOs } from "@/components/state/life-os-provider";
import { lifeSections } from "@/lib/life-os-data";
import { SectionHeader } from "@/components/ui/section-header";

export default function NotesPage() {
  const { notes } = useLifeOs();
  const sections = lifeSections.map((section) =>
    section.id === "life-notes" ? { ...section, itemCount: notes.length } : section,
  );

  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Notes"
        title="Personal life database"
        description="Store ideas, health reminders, shopping lists, goals, and daily reflections."
      />
      <NotesManager />
      <PersonalDatabase sections={sections} />
    </div>
  );
}
