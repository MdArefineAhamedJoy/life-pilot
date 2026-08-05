"use client";

import { useState } from "react";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldShell, TextInput } from "@/components/ui/field";
import { formatCurrency } from "@/lib/utils";

export function CategoryManager() {
  const { categories, updateCategoryLimit } = useLifeOs();
  const [draftLimits, setDraftLimits] = useState(() =>
    Object.fromEntries(categories.map((category) => [category.id, String(category.monthlyLimit)])),
  );

  return (
    <Card title="Category Limit Manager" eyebrow="Plan">
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {categories.map((category) => (
          <div className="rounded-md border border-zinc-100 bg-zinc-50 p-3" key={category.id}>
            <FieldShell label={category.name}>
              <TextInput
                min="0"
                onChange={(event) =>
                  setDraftLimits((current) => ({
                    ...current,
                    [category.id]: event.target.value,
                  }))
                }
                type="number"
                value={draftLimits[category.id] ?? String(category.monthlyLimit)}
              />
            </FieldShell>
            <div className="mt-3 flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
              <span className="text-xs text-zinc-500">Current {formatCurrency(category.monthlyLimit)}</span>
              <Button
                className="min-h-9 px-3 py-1 text-xs min-[420px]:min-h-8"
                onClick={() => updateCategoryLimit(category.id, Number(draftLimits[category.id]) || 0)}
                type="button"
                variant="secondary"
              >
                Update
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
