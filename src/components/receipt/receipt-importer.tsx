"use client";

import { useMemo, useState } from "react";
import { useLifeOs } from "@/components/state/life-os-provider";
import { parseReceiptText } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import { FieldShell, TextArea, TextInput } from "@/components/ui/field";

type ParsedReceiptRow = ReturnType<typeof parseReceiptText>[number];

export function ReceiptImporter() {
  const { addExpensesFromRows } = useLifeOs();
  const [rawText, setRawText] = useState("Potato 80\nFish 520\nBaby food 650");
  const [savedMessage, setSavedMessage] = useState("");
  const parsedRows = useMemo(() => parseReceiptText(rawText), [rawText]);
  const total = parsedRows.reduce((sum, row) => sum + row.amount, 0);

  const columns: TableColumn<ParsedReceiptRow>[] = [
    { key: "item", header: "Item", render: (row) => row.itemName },
    { key: "category", header: "Category", render: (row) => <Badge>{row.category}</Badge> },
    { key: "qty", header: "Qty", render: (row) => row.quantity },
    { key: "amount", header: "Amount", align: "right", render: (row) => formatCurrency(row.amount) },
  ];

  return (
    <Card title="Slip Text To Table" eyebrow="Scan slip" id="scan-slip">
      <div className="grid min-w-0 gap-5 2xl:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <FieldShell hint="OCR can fill this field later. For now paste receipt text manually." label="Receipt text">
            <TextArea onChange={(event) => setRawText(event.target.value)} value={rawText} />
          </FieldShell>
          <FieldShell hint="Ready for future Tesseract.js/browser OCR integration." label="Receipt image">
            <TextInput accept="image/*" type="file" />
          </FieldShell>
          <div className="flex items-center justify-between rounded-md bg-zinc-50 p-3">
            <span className="text-sm font-medium text-zinc-600">Parsed total</span>
            <span className="text-lg font-semibold text-zinc-950">{formatCurrency(total)}</span>
          </div>
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              addExpensesFromRows(parsedRows);
              setSavedMessage(`${parsedRows.filter((row) => row.amount > 0).length} rows saved to expenses.`);
            }}
            type="button"
          >
            Review and save
          </Button>
          {savedMessage && <p className="text-sm font-medium text-teal-700">{savedMessage}</p>}
        </div>
        <DataTable columns={columns} getRowKey={(row) => row.id} rows={parsedRows} />
      </div>
    </Card>
  );
}
