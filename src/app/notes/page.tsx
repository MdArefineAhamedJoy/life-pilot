"use client";

import { NotesAiAssistantDrawer } from "./components/notes-ai-assistant";
import { NotesCreateAction, NotesManager } from "@/app/notes/components/notes-manager";
import { SectionHeader } from "@/components/ui/section-header";

export default function NotesPage() {
  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <SectionHeader
          eyebrow="Notes"
          title="Personal life database"
          description="Store ideas, health reminders, shopping lists, goals, and daily reflections."
        />
        <div className="flex flex-wrap items-center gap-2 lg:shrink-0 lg:justify-end">
          <NotesAiAssistantDrawer />
          <NotesCreateAction />
        </div>
      </div>
      <NotesManager />
    </div>
  );
}
