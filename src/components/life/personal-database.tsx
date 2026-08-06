import type { LifeNoteSection } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type PersonalDatabaseProps = {
  sections: LifeNoteSection[];
};

export function PersonalDatabase({ sections }: PersonalDatabaseProps) {
  return (
    <Card title="Personal Life Database" eyebrow="Notes" id="notes">
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        {sections.map((section) => (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4" key={section.id}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 break-words text-sm font-semibold text-slate-800">{section.title}</h3>
              <Badge tone="teal">{section.itemCount}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
