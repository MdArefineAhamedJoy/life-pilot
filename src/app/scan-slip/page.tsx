"use client";

import { ReceiptImporter } from "@/components/receipt/receipt-importer";
import { SectionHeader } from "@/components/ui/section-header";

export default function ScanSlipPage() {
  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Scan slip"
        title="Receipt text to expense table"
        description="Paste bajar slip text or attach an image placeholder, review parsed rows, then save them as expenses."
      />
      <ReceiptImporter />
    </div>
  );
}
