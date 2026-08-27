"use client";

import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { DataTable, type TableColumn } from "@/components/shared/data-table";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldShell, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import type { LifeNote } from "@/lib/types";

const noteTypes = [
  { value: "daily", label: "Daily note" },
  { value: "money", label: "Money / payment" },
  { value: "reminder", label: "Reminder / task" },
  { value: "file", label: "File / receipt" },
  { value: "balance", label: "Balance review" },
];

const relatedAreas = [
  "Notes",
  "Budget",
  "Expenses",
  "Receipt scanner",
  "Routine",
  "Dashboard",
  "Reports",
  "Settings",
];

const priorities = ["Low", "Medium", "High"];

function getNoteField(note: LifeNote, field: string) {
  const line = note.body.split(/\r?\n/).find((item) => item.toLowerCase().startsWith(`${field.toLowerCase()}:`));
  return line?.slice(field.length + 1).trim() ?? "";
}

function getNoteDetails(note: LifeNote) {
  return note.body
    .split(/\r?\n/)
    .filter((line) => !/^(type|related area|category|date|amount|payment|priority|source|action|expense item):/i.test(line))
    .join(" ")
    .trim();
}

function getNoteTypeValue(note?: LifeNote) {
  const label = note ? getNoteField(note, "Type") : "";
  return noteTypes.find((type) => type.label === label)?.value ?? "daily";
}

function uniqueTags(tags: string[]) {
  return Array.from(new Set(tags.filter(Boolean)));
}

function buildNoteBody({
  noteType,
  title,
  body,
  relatedArea,
  category,
  noteDate,
  amount,
  paymentMethod,
  priority,
  source,
  action,
}: {
  noteType: string;
  title: string;
  body: string;
  relatedArea: string;
  category: string;
  noteDate: string;
  amount: string;
  paymentMethod: string;
  priority: string;
  source: string;
  action: string;
}) {
  return [
    `Type: ${noteTypes.find((type) => type.value === noteType)?.label ?? "Daily note"}`,
    `Related area: ${relatedArea}`,
    category !== "General" ? `Category: ${category}` : "",
    noteDate ? `Date: ${noteDate}` : "",
    amount ? `Amount: BDT ${amount}` : "",
    paymentMethod ? `Payment: ${paymentMethod}` : "",
    `Priority: ${priority}`,
    source ? `Source: ${source}` : "",
    action ? `Action: ${action}` : "",
    amount ? `Expense item: ${title} ${amount}` : "",
    "",
    body,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function NoteEditorDialog({
  mode,
  note,
  onOpenChange,
  open,
}: {
  mode: "create" | "edit";
  note?: LifeNote;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  const { addNote, categories, updateNote } = useLifeOs();
  const [noteType, setNoteType] = useState(getNoteTypeValue(note));
  const isEdit = mode === "edit";

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const body = String(data.get("body") ?? "").trim();
    const relatedArea = String(data.get("relatedArea") ?? "Notes");
    const category = String(data.get("category") ?? "General");
    const noteDate = String(data.get("noteDate") ?? "");
    const amount = String(data.get("amount") ?? "").trim();
    const paymentMethod = String(data.get("paymentMethod") ?? "");
    const priority = String(data.get("priority") ?? "Medium");
    const source = String(data.get("source") ?? "").trim();
    const action = String(data.get("action") ?? "").trim();
    const tags = String(data.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const smartTags = [
      noteType,
      relatedArea.toLowerCase().replace(/\s+/g, "-"),
      category !== "General" ? category.toLowerCase().replace(/\s+/g, "-") : "",
      priority === "High" ? "high-priority" : "",
      amount ? "money" : "",
      action ? "action" : "",
      source ? "file" : "",
    ].filter(Boolean);

    if (!title || !body) {
      return;
    }

    const nextNote = {
      title,
      body: buildNoteBody({
        noteType,
        title,
        body,
        relatedArea,
        category,
        noteDate,
        amount,
        paymentMethod,
        priority,
        source,
        action,
      }),
      tags: uniqueTags([...tags, ...smartTags]),
    };

    if (isEdit && note) {
      updateNote(note.id, nextNote);
    } else {
      addNote(nextNote);
      form.reset();
    }

    handleOpenChange(false);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="flex h-[86vh] !w-[min(94vw,920px)] max-w-none grid-rows-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-4 py-3">
          <DialogTitle>{isEdit ? "Edit note" : "Create note"}</DialogTitle>
          <DialogDescription>
            Capture daily details with money, file, reminder, and balance context for AI review.
          </DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div className="grid min-w-0 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="grid min-w-0 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FieldShell label="Title">
                    <TextInput
                      defaultValue={note?.title ?? ""}
                      name="title"
                      placeholder="Bajar payment, rent reminder, receipt file"
                      required
                    />
                  </FieldShell>
                </div>
                <FieldShell label="Note type">
                  <SelectInput name="noteType" onChange={(event) => setNoteType(event.target.value)} value={noteType}>
                    {noteTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </SelectInput>
                </FieldShell>
                <FieldShell label="Related area">
                  <SelectInput defaultValue={note ? getNoteField(note, "Related area") || "Notes" : "Notes"} name="relatedArea">
                    {relatedAreas.map((area) => (
                      <option key={area}>{area}</option>
                    ))}
                  </SelectInput>
                </FieldShell>
                <FieldShell label="Budget category">
                  <SelectInput defaultValue={note ? getNoteField(note, "Category") || "General" : "General"} name="category">
                    <option>General</option>
                    {categories.map((category) => (
                      <option key={category.id}>{category.name}</option>
                    ))}
                  </SelectInput>
                </FieldShell>
                <FieldShell label="Date">
                  <TextInput defaultValue={note ? getNoteField(note, "Date") : ""} name="noteDate" type="date" />
                </FieldShell>
                <FieldShell label="Amount">
                  <TextInput
                    defaultValue={note ? getNoteField(note, "Amount").replace(/^BDT\s+/i, "") : ""}
                    min="0"
                    name="amount"
                    placeholder="520"
                    type="number"
                  />
                </FieldShell>
                <FieldShell label="Payment method">
                  <SelectInput defaultValue={note ? getNoteField(note, "Payment") : ""} name="paymentMethod">
                    <option value="">Not set</option>
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Mobile banking</option>
                  </SelectInput>
                </FieldShell>
                <FieldShell label="Priority">
                  <SelectInput defaultValue={note ? getNoteField(note, "Priority") || "Medium" : "Medium"} name="priority">
                    {priorities.map((priority) => (
                      <option key={priority}>{priority}</option>
                    ))}
                  </SelectInput>
                </FieldShell>
                <FieldShell label="Source / file">
                  <TextInput
                    defaultValue={note ? getNoteField(note, "Source") : ""}
                    name="source"
                    placeholder="Receipt image, PDF, bank SMS, manual note"
                  />
                </FieldShell>
                <div className="md:col-span-2">
                  <FieldShell label="Action item">
                    <TextInput
                      defaultValue={note ? getNoteField(note, "Action") : ""}
                      name="action"
                      placeholder="Pay bill, add expense, review budget, call someone"
                    />
                  </FieldShell>
                </div>
                <div className="md:col-span-2">
                  <FieldShell label="Note details">
                    <TextArea
                      className="min-h-32"
                      defaultValue={note ? getNoteDetails(note) : ""}
                      name="body"
                      placeholder="Write the full note, context, decision, or reminder"
                      required
                    />
                  </FieldShell>
                </div>
                <div className="md:col-span-2">
                  <FieldShell hint="Separate tags with comma. Smart tags are added automatically." label="Manual tags">
                    <TextInput defaultValue={note?.tags.join(", ") ?? ""} name="tags" placeholder="health, goal, budget" />
                  </FieldShell>
                </div>
              </div>

              <aside className="min-w-0 rounded-md border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase text-emerald-700">AI helper</p>
                <h3 className="mt-2 text-base font-semibold text-slate-950">This note will be easier to use</h3>
                <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  <p>Money fields help the assistant find payments, spending, and draft expense rows.</p>
                  <p>Category and related area connect the note with budget, expenses, receipt scanner, routine, or dashboard context.</p>
                  <p>Action and priority make reminders visible in the AI review without changing any workflow automatically.</p>
                </div>
                <div className="mt-4 rounded-md border border-emerald-200 bg-white p-3 text-sm text-slate-600">
                  Current type:{" "}
                  <span className="font-semibold text-slate-900">
                    {noteTypes.find((type) => type.value === noteType)?.label}
                  </span>
                </div>
              </aside>
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-200 p-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Update note" : "Save note"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function NotesCreateAction() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <Button
        icon={<Plus aria-hidden="true" className="size-4" />}
        onClick={() => setIsAddModalOpen(true)}
        type="button"
      >
        Add note
      </Button>
      {isAddModalOpen && <NoteEditorDialog mode="create" onOpenChange={setIsAddModalOpen} open={isAddModalOpen} />}
    </>
  );
}

function DetailTile({ label, value }: { label: string; value?: string }) {
  return (
    <div className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-900">{value || "-"}</p>
    </div>
  );
}

export function NotesManager() {
  const { deleteNote, notes } = useLifeOs();
  const [viewNote, setViewNote] = useState<LifeNote | undefined>();
  const [editNote, setEditNote] = useState<LifeNote | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<LifeNote | undefined>();
  const columns: TableColumn<LifeNote>[] = [
    {
      key: "note",
      header: "Note",
      render: (note) => (
        <div className="max-w-[280px]">
          <p className="truncate font-semibold text-slate-900">{note.title}</p>
          <p className="mt-0.5 truncate text-xs text-slate-500">{getNoteDetails(note) || note.body}</p>
        </div>
      ),
      width: "280px",
    },
    {
      key: "type",
      header: "Type",
      render: (note) => <Badge tone="neutral">{getNoteField(note, "Type") || "Daily note"}</Badge>,
    },
    {
      key: "related",
      header: "Related",
      render: (note) => (
        <div className="max-w-[170px]">
          <p className="truncate font-medium text-slate-800">{getNoteField(note, "Related area") || "Notes"}</p>
          <p className="mt-0.5 truncate text-xs text-slate-500">{getNoteField(note, "Category") || "General"}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (note) => <span className="font-mono font-semibold text-slate-800">{getNoteField(note, "Amount") || "-"}</span>,
    },
    {
      key: "actionItem",
      header: "Action item",
      render: (note) => (
        <span className="block max-w-[180px] truncate text-slate-600">{getNoteField(note, "Action") || "-"}</span>
      ),
    },
    {
      key: "tags",
      header: "Tags",
      render: (note) => (
        <div className="flex max-w-[250px] flex-nowrap gap-1.5 overflow-hidden">
          {note.tags.slice(0, 3).map((tag) => (
            <Badge className="shrink-0" key={tag} tone="teal">
              {tag}
            </Badge>
          ))}
          {note.tags.length > 3 && (
            <Badge className="shrink-0" tone="neutral">
              +{note.tags.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      align: "right",
      render: (note) => <span className="text-slate-500">{new Date(note.updatedAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (note) => (
        <div className="inline-flex items-center gap-1">
          <button
            aria-label={`View ${note.title}`}
            className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
            onClick={() => setViewNote(note)}
            title="View details"
            type="button"
          >
            <Eye aria-hidden="true" className="size-4" />
          </button>
          <button
            aria-label={`Edit ${note.title}`}
            className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600"
            onClick={() => setEditNote(note)}
            title="Edit"
            type="button"
          >
            <Pencil aria-hidden="true" className="size-4" />
          </button>
          <button
            aria-label={`Delete ${note.title}`}
            className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            onClick={() => setDeleteTarget(note)}
            title="Delete"
            type="button"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="min-w-0 overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="flex min-h-14 items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-emerald-600">Database</p>
            <h2 className="truncate text-base font-semibold text-slate-950">Saved notes</h2>
          </div>
        </div>
        <DataTable
          cellClassName="px-3 py-2"
          className="rounded-none border-0"
          columns={columns}
          emptyMessage="No notes saved yet."
          getRowKey={(note) => note.id}
          minHeightClassName="min-h-[420px]"
          pageSize={8}
          rowClassName="h-14"
          rows={notes}
          tableClassName="min-w-[1120px]"
        />
      </section>

      <Dialog onOpenChange={(open) => !open && setViewNote(undefined)} open={Boolean(viewNote)}>
        <DialogContent className="!w-[min(94vw,860px)] max-w-none gap-0 p-0">
          <DialogHeader className="border-b border-slate-200 px-5 py-4">
            <DialogTitle>{viewNote?.title ?? "Note details"}</DialogTitle>
            <DialogDescription>Review every saved field for this note.</DialogDescription>
          </DialogHeader>
          {viewNote && (
            <div className="modal-scrollbar max-h-[70vh] overflow-y-auto p-5">
              <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase text-emerald-700">Note summary</p>
                <h3 className="mt-2 break-words text-xl font-semibold text-slate-950">{viewNote.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{getNoteDetails(viewNote) || viewNote.body}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <DetailTile label="Type" value={getNoteField(viewNote, "Type") || "Daily note"} />
                <DetailTile label="Related area" value={getNoteField(viewNote, "Related area") || "Notes"} />
                <DetailTile label="Category" value={getNoteField(viewNote, "Category") || "General"} />
                <DetailTile label="Date" value={getNoteField(viewNote, "Date")} />
                <DetailTile label="Amount" value={getNoteField(viewNote, "Amount")} />
                <DetailTile label="Payment" value={getNoteField(viewNote, "Payment")} />
                <DetailTile label="Priority" value={getNoteField(viewNote, "Priority") || "Medium"} />
                <DetailTile label="Source / file" value={getNoteField(viewNote, "Source")} />
                <DetailTile label="Action item" value={getNoteField(viewNote, "Action")} />
                <DetailTile label="Created" value={new Date(viewNote.createdAt).toLocaleString()} />
                <DetailTile label="Updated" value={new Date(viewNote.updatedAt).toLocaleString()} />
                <DetailTile label="Expense draft" value={getNoteField(viewNote, "Expense item")} />
              </div>

              <div className="mt-5 rounded-md border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {viewNote.tags.length > 0 ? (
                    viewNote.tags.map((tag) => (
                      <Badge key={tag} tone="teal">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">No tags</span>
                  )}
                </div>
              </div>

              <div className="mt-5 rounded-md border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Full note body</p>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{viewNote.body}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {editNote && (
        <NoteEditorDialog
          mode="edit"
          note={editNote}
          onOpenChange={(open) => !open && setEditNote(undefined)}
          open={Boolean(editNote)}
        />
      )}

      <ConfirmationModal
        actionLabel="Delete"
        description={
          deleteTarget
            ? `This will permanently delete "${deleteTarget.title}" from saved notes.`
            : "This will delete the selected note."
        }
        onConfirm={() => {
          if (deleteTarget) {
            deleteNote(deleteTarget.id);
          }
        }}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
        open={Boolean(deleteTarget)}
        title="Delete note"
        variant="danger"
      />
    </>
  );
}
