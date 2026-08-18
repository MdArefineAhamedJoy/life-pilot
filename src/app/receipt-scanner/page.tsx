"use client";

import { CalendarDays, FileImage, ReceiptText, Save, ScanText, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { SharedCard, StatCard } from "@/components/shared/card";
import { DataTable, type TableColumn } from "@/components/shared/data-table";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldShell, TextArea, TextInput } from "@/components/ui/field";
import { SectionHeader } from "@/components/ui/section-header";
import { parseReceiptText } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

type ParsedReceiptRow = ReturnType<typeof parseReceiptText>[number];

export default function ReceiptScannerPage() {
  const { addExpensesFromRows } = useLifeOs();
  const [rawText, setRawText] = useState("Potato 80\nFish 520\nBaby food 650");
  const [saveDate, setSaveDate] = useState("");
  const [imageName, setImageName] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const parsedRows = useMemo(() => parseReceiptText(rawText), [rawText]);
  const validRows = parsedRows.filter((row) => row.itemName.trim() && row.amount > 0);
  const total = validRows.reduce((sum, row) => sum + row.amount, 0);

  const columns: TableColumn<ParsedReceiptRow>[] = [
    {
      key: "item",
      header: "Item",
      render: (row) => <span className="font-medium text-slate-900">{row.itemName}</span>,
    },
    { key: "category", header: "Category", render: (row) => <Badge>{row.category}</Badge> },
    { key: "qty", header: "Qty", render: (row) => <span className="font-mono">{row.quantity}</span> },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (row) => <span className="font-mono font-semibold text-slate-900">{formatCurrency(row.amount)}</span>,
    },
  ];

  function handleSave() {
    addExpensesFromRows(validRows, saveDate || undefined);
    setSavedMessage(`${validRows.length} rows saved to expenses.`);
  }

  function handleClear() {
    setRawText("");
    setImageName("");
    setSavedMessage("");
  }

  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Scan slip"
        title="Receipt text to expense table"
        description="Paste bajar slip text or attach an image placeholder, review parsed rows, then save them as expenses."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          detail="Ready amount"
          icon={ReceiptText}
          label="Parsed total"
          progress={validRows.length > 0 ? 100 : 0}
          tone="emerald"
          value={formatCurrency(total)}
        />
        <StatCard
          detail={`${parsedRows.length} parsed lines`}
          icon={ScanText}
          label="Valid rows"
          progress={parsedRows.length > 0 ? Math.round((validRows.length / parsedRows.length) * 100) : 0}
          tone="blue"
          value={String(validRows.length)}
        />
        <StatCard
          detail={imageName ? "Uploaded reference" : "Manual paste"}
          icon={FileImage}
          label="Image source"
          progress={imageName ? 100 : 25}
          tone="amber"
          value={imageName || "Text entry"}
        />
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
        <SharedCard className="!p-0">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase text-emerald-600">Input</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">Receipt content</h2>
          </div>
          <div className="space-y-4 p-5">
            <FieldShell label="Save date">
              <span className="relative block">
                <CalendarDays
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                />
                <TextInput
                  className="h-11 bg-white pl-10"
                  onChange={(event) => setSaveDate(event.target.value)}
                  type="date"
                  value={saveDate}
                />
              </span>
            </FieldShell>
            <FieldShell hint="Paste one item per line, with the amount at the end." label="Receipt text">
              <TextArea
                className="min-h-[260px] resize-none bg-white"
                onChange={(event) => {
                  setRawText(event.target.value);
                  setSavedMessage("");
                }}
                placeholder={"Potato 80\nFish 520\nBaby food 650"}
                value={rawText}
              />
            </FieldShell>
            <FieldShell hint="OCR is not connected yet. The file name is kept as a source reference." label="Receipt image">
              <TextInput
                accept="image/*"
                className="h-11 bg-white"
                onChange={(event) => setImageName(event.target.files?.[0]?.name ?? "")}
                type="file"
              />
            </FieldShell>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-emerald-600">Ready to save</span>
                <span className="font-mono text-lg font-semibold text-slate-800">{formatCurrency(total)}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{validRows.length} valid expense rows will be added.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="w-full sm:w-auto"
                disabled={validRows.length === 0}
                icon={<Save aria-hidden="true" className="size-4" />}
                onClick={handleSave}
                type="button"
              >
                Save to expenses
              </Button>
              <Button
                className="w-full sm:w-auto"
                icon={<Trash2 aria-hidden="true" className="size-4" />}
                onClick={handleClear}
                type="button"
                variant="outline"
              >
                Clear
              </Button>
            </div>
            {savedMessage && <p className="text-sm font-medium text-green-500">{savedMessage}</p>}
          </div>
        </SharedCard>

        <SharedCard className="flex min-h-[600px] flex-col !p-0">
          <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase text-emerald-600">Preview</p>
            <h2 className="text-lg font-semibold text-slate-950">Parsed expense rows</h2>
          </div>
          <DataTable
            className="flex-1 rounded-none border-0"
            columns={columns}
            emptyMessage="Paste receipt text to preview rows."
            getRowKey={(row) => row.id}
            minHeightClassName="min-h-0"
            rows={parsedRows}
          />
        </SharedCard>
      </div>
    </div>
  );
}
