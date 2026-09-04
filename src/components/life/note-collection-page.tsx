"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextArea, TextInput } from "@/components/ui/field";
import { SectionHeader } from "@/components/ui/section-header";

type NoteCollectionPageProps = {
  tag: string;
  eyebrow: string;
  title: string;
  description: string;
  addLabel: string;
  emptyLabel: string;
};

export function NoteCollectionPage({ tag, eyebrow, title, description, addLabel, emptyLabel }: NoteCollectionPageProps) {
  const { addNote, deleteNote, notes } = useLifeOs();
  const [isCreating, setIsCreating] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const entries = useMemo(
    () => notes.filter((note) => note.tags.some((noteTag) => noteTag.toLowerCase() === tag.toLowerCase())),
    [notes, tag],
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!noteTitle.trim()) return;

    addNote({ title: noteTitle.trim(), body: noteBody.trim(), tags: [tag] });
    setNoteTitle("");
    setNoteBody("");
    setIsCreating(false);
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <Button icon={<Plus aria-hidden="true" className="size-4" />} onClick={() => setIsCreating(true)} type="button">
          {addLabel}
        </Button>
      </div>

      {isCreating ? (
        <Card title={addLabel} eyebrow="New entry">
          <form className="space-y-4" onSubmit={submit}>
            <TextInput onChange={(event) => setNoteTitle(event.target.value)} placeholder="Title" required value={noteTitle} />
            <TextArea onChange={(event) => setNoteBody(event.target.value)} placeholder="Details, plan, or checklist" value={noteBody} />
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button onClick={() => setIsCreating(false)} type="button" variant="outline">Cancel</Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <Card key={entry.id} title={entry.title} eyebrow={new Date(entry.updatedAt).toLocaleDateString()}>
            <div className="space-y-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{entry.body || "No details added yet."}</p>
              <Button
                className="text-red-600 hover:text-red-700"
                icon={<Trash2 aria-hidden="true" className="size-4" />}
                onClick={() => deleteNote(entry.id)}
                type="button"
                variant="ghost"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {!entries.length ? <Card title={emptyLabel} eyebrow="No entries yet" /> : null}
    </div>
  );
}
