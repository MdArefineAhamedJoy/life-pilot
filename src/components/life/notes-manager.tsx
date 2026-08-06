"use client";

import { useLifeOs } from "@/components/state/life-os-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldShell, TextArea, TextInput } from "@/components/ui/field";

export function NotesManager() {
  const { addNote, notes } = useLifeOs();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const tags = String(data.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    addNote({
      title: String(data.get("title") ?? ""),
      body: String(data.get("body") ?? ""),
      tags,
    });

    form.reset();
  }

  return (
    <div className="grid min-w-0 gap-5 2xl:grid-cols-[0.9fr_1.1fr]">
      <Card title="Add Note" eyebrow="Capture">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FieldShell label="Title">
            <TextInput name="title" placeholder="Health reminder, idea, shopping list" required />
          </FieldShell>
          <FieldShell label="Body">
            <TextArea name="body" placeholder="Write the note" required />
          </FieldShell>
          <FieldShell hint="Separate tags with comma." label="Tags">
            <TextInput name="tags" placeholder="health, goal, budget" />
          </FieldShell>
          <Button className="w-full sm:w-auto" type="submit">Save note</Button>
        </form>
      </Card>
      <Card title="Saved Notes" eyebrow="Database">
        <div className="space-y-3">
          {notes.map((note) => (
            <article className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-4" key={note.id}>
              <h3 className="break-words text-sm font-semibold text-slate-800">{note.title}</h3>
              <p className="mt-2 break-words text-sm leading-6 text-slate-600">{note.body}</p>
              {note.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <Badge key={tag} tone="teal">{tag}</Badge>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
