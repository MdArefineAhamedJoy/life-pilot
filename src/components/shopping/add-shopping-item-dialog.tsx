"use client";

import { Skeleton } from "@/components/shared/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldShell, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import { useFormatCurrency } from "@/hooks/use-format-currency";
import type { BudgetCategory } from "@/lib/types";
import { localDateKey } from "@/lib/utils";
import { categoriesService } from "@/services/categories.service";
import { shoppingService } from "@/services/shopping.service";
import type { ShoppingDocument, WarrantyStatus } from "@/types/shopping.types";
import { Plus, ReceiptText, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

type AddShoppingItemDialogProps = { onSaved: () => void };

const maxFileSize = 2 * 1024 * 1024;
const acceptedDocumentTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

async function readDocuments(files: FileList | null): Promise<ShoppingDocument[]> {
  const selectedFiles = Array.from(files ?? []);
  if (selectedFiles.length > 5) throw new Error("You can attach up to 5 files at a time.");
  return Promise.all(
    selectedFiles.map(
      (file) =>
        new Promise<ShoppingDocument>((resolve, reject) => {
          if (!acceptedDocumentTypes.includes(file.type) || file.size > maxFileSize) {
            reject(new Error("Files must be JPG, PNG, WEBP, or PDF and no larger than 2 MB."));
            return;
          }
          const reader = new FileReader();
          reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
          reader.onload = () =>
            resolve({ fileName: file.name, mimeType: file.type, size: file.size, dataUrl: String(reader.result) });
          reader.readAsDataURL(file);
        })
    )
  );
}

export function AddShoppingItemDialog({ onSaved }: AddShoppingItemDialogProps) {
  const formatCurrency = useFormatCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [manualSubCategory, setManualSubCategory] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [productPrice, setProductPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [warrantyStatus, setWarrantyStatus] = useState<WarrantyStatus>("none");
  const [receiptDocuments, setReceiptDocuments] = useState<ShoppingDocument[]>([]);
  const [warrantyDocuments, setWarrantyDocuments] = useState<ShoppingDocument[]>([]);
  const [error, setError] = useState("");
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const suggestedSubcategories = useMemo(
    () => categories.find((category) => category.name.trim().toLowerCase() === "shopping")?.subcategories ?? [],
    [categories]
  );
  const calculatedTotal = (Number(productPrice) || 0) * (Number(quantity) || 0);

  useEffect(() => {
    if (!isOpen) return;
    async function loadCategories() {
      setIsCategoriesLoading(true);
      setError("");
      try {
        setCategories(await categoriesService.list());
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Failed to load subcategories.");
      } finally {
        setIsCategoriesLoading(false);
      }
    }
    void loadCategories();
  }, [isOpen]);

  function resetForm() {
    setSelectedSubCategory("");
    setManualSubCategory("");
    setQuantity("1");
    setProductPrice("");
    setTotalPrice("");
    setWarrantyStatus("none");
    setReceiptDocuments([]);
    setWarrantyDocuments([]);
    setError("");
  }

  function updatePrice(nextPrice: string, nextQuantity = quantity) {
    setProductPrice(nextPrice);
    setTotalPrice(String((Number(nextPrice) || 0) * (Number(nextQuantity) || 0)));
  }

  async function handleDocuments(
    event: ChangeEvent<HTMLInputElement>,
    setDocuments: (documents: ShoppingDocument[]) => void
  ) {
    try {
      setDocuments(await readDocuments(event.target.files));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not attach the selected files.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const subCategory = manualSubCategory.trim() || selectedSubCategory;
    if (!subCategory) {
      setError("Choose a saved subcategory or enter one manually.");
      return;
    }
    if (!receiptDocuments.length) {
      setError("Attach the purchase receipt to keep a complete shopping record.");
      return;
    }
    if (warrantyStatus !== "none" && !warrantyDocuments.length) {
      setError("Attach the warranty or guarantee document.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await shoppingService.create({
        name: String(data.get("name") ?? ""),
        category: "Shopping",
        subCategory,
        brand: String(data.get("brand") ?? ""),
        model: String(data.get("model") ?? ""),
        storeName: String(data.get("storeName") ?? ""),
        quantity: Number(quantity) || 1,
        unit: String(data.get("unit") ?? ""),
        productPrice: Number(productPrice) || 0,
        totalPrice: Number(totalPrice) || 0,
        estimatedPrice: Number(totalPrice) || 0,
        purchaseDate: String(data.get("purchaseDate") || localDateKey()),
        paymentMethod: String(data.get("paymentMethod") ?? ""),
        receiptDocuments,
        warrantyStatus,
        warrantyExpiresAt: String(data.get("warrantyExpiresAt") ?? ""),
        warrantyNote: String(data.get("warrantyNote") ?? ""),
        warrantyDocuments,
        status: "purchased",
        note: String(data.get("note") ?? ""),
      });
      form.reset();
      resetForm();
      setIsOpen(false);
      onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to save shopping purchase.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full shadow-sm transition-shadow hover:shadow-md sm:w-auto"
          icon={<Plus aria-hidden="true" className="size-4" />}
          type="button"
        >
          Add purchase
        </Button>
      </DialogTrigger>
      <DialogContent className="!flex h-[calc(100dvh-2rem)] max-h-[900px] !w-[min(94vw,840px)] max-w-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-5 py-4">
          <DialogTitle>Add shopping purchase</DialogTitle>
          <DialogDescription>Save every purchase detail, receipt, and warranty in one record.</DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="modal-scrollbar min-h-0 flex-1 overflow-y-scroll pr-2">
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 md:col-span-2">
                <p className="text-sm font-medium text-emerald-700">Category</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">Shopping</p>
                <p className="mt-1 text-xs text-slate-600">This purchase is automatically counted in your Shopping budget and total spending.</p>
              </div>
              <FieldShell label="Product name">
                <TextInput name="name" placeholder="Walton refrigerator, baby formula" required />
              </FieldShell>
              <FieldShell label="Purchase date">
                <TextInput defaultValue={localDateKey()} name="purchaseDate" required type="date" />
              </FieldShell>
              <FieldShell hint="Select one of the saved Shopping subcategories." label="Saved subcategory">
                {isCategoriesLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <SelectInput
                    aria-invalid={Boolean(error && !selectedSubCategory && !manualSubCategory)}
                    onChange={(event) => setSelectedSubCategory(event.target.value)}
                    value={selectedSubCategory}
                  >
                    <option value="">Select a subcategory</option>
                    {suggestedSubcategories.map((item) => <option key={item} value={item}>{item}</option>)}
                  </SelectInput>
                )}
              </FieldShell>
              <FieldShell hint="This is optional when you select a saved subcategory." label="Or enter subcategory manually">
                <TextInput
                  aria-invalid={Boolean(error && !selectedSubCategory && !manualSubCategory)}
                  onChange={(event) => setManualSubCategory(event.target.value)}
                  placeholder="e.g. Electricity, baby market, shirt"
                  value={manualSubCategory}
                />
              </FieldShell>
              <FieldShell label="Store / seller">
                <TextInput name="storeName" placeholder="Shop name or online seller" />
              </FieldShell>
              <FieldShell label="Brand">
                <TextInput name="brand" placeholder="Optional" />
              </FieldShell>
              <FieldShell label="Model / SKU">
                <TextInput name="model" placeholder="Optional" />
              </FieldShell>
              <FieldShell label="Unit price">
                <TextInput min="0" onChange={(event) => updatePrice(event.target.value)} placeholder="0" step="0.01" type="number" value={productPrice} />
              </FieldShell>
              <FieldShell label="Quantity">
                <TextInput min="1" onChange={(event) => { setQuantity(event.target.value); setTotalPrice(String((Number(productPrice) || 0) * (Number(event.target.value) || 0))); }} step="0.01" type="number" value={quantity} />
              </FieldShell>
              <FieldShell label="Unit">
                <TextInput name="unit" placeholder="piece, kg, pack" />
              </FieldShell>
              <FieldShell label="Payment method">
                <SelectInput name="paymentMethod">
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Mobile banking">Mobile banking</option>
                  <option value="Bank transfer">Bank transfer</option>
                  <option value="Other">Other</option>
                </SelectInput>
              </FieldShell>
              <FieldShell hint={`Calculated: ${formatCurrency(calculatedTotal)}`} label="Total paid">
                <TextInput min="0" onChange={(event) => setTotalPrice(event.target.value)} placeholder="0" required step="0.01" type="number" value={totalPrice} />
              </FieldShell>
              <FieldShell hint="Required: JPG, PNG, WEBP, or PDF; max 2 MB each." label="Purchase receipt">
                <TextInput accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={(event) => void handleDocuments(event, setReceiptDocuments)} type="file" />
              </FieldShell>
              <DocumentList documents={receiptDocuments} icon={<ReceiptText aria-hidden="true" className="size-4" />} />
              <FieldShell label="Warranty / guarantee">
                <SelectInput onChange={(event) => setWarrantyStatus(event.target.value as WarrantyStatus)} value={warrantyStatus}>
                  <option value="none">No warranty or guarantee</option>
                  <option value="warranty">Warranty</option>
                  <option value="guarantee">Guarantee</option>
                  <option value="both">Warranty and guarantee</option>
                </SelectInput>
              </FieldShell>
              {warrantyStatus !== "none" && (
                <>
                  <FieldShell label="Warranty expiry date">
                    <TextInput name="warrantyExpiresAt" type="date" />
                  </FieldShell>
                  <div className="md:col-span-2">
                    <FieldShell hint="Required if warranty or guarantee applies." label="Warranty document">
                      <TextInput accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={(event) => void handleDocuments(event, setWarrantyDocuments)} type="file" />
                    </FieldShell>
                    <DocumentList documents={warrantyDocuments} icon={<ShieldCheck aria-hidden="true" className="size-4" />} />
                  </div>
                  <div className="md:col-span-2">
                    <FieldShell label="Warranty details">
                      <TextArea className="min-h-20" name="warrantyNote" placeholder="Coverage, service centre, claim instructions" />
                    </FieldShell>
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <FieldShell label="Note">
                  <TextArea className="min-h-20" name="note" placeholder="Colour, delivery details, or other purchase information" />
                </FieldShell>
              </div>
              {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 md:col-span-2" role="alert">{error}</p>}
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-200 px-5 py-3">
            <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
              <Button disabled={isSaving} onClick={() => setIsOpen(false)} type="button" variant="outline">
                Cancel
              </Button>
              <Button disabled={isSaving || isCategoriesLoading} type="submit">
                {isSaving ? "Saving..." : "Save purchase"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DocumentList({ documents, icon }: { documents: ShoppingDocument[]; icon: ReactNode }) {
  if (!documents.length) return null;
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 md:col-span-2">
      <div className="flex items-center gap-2 font-medium text-slate-700">{icon} Attached files</div>
      <ul className="mt-2 space-y-1">
        {documents.map((document) => <li className="truncate" key={`${document.fileName}-${document.size}`}>{document.fileName}</li>)}
      </ul>
    </div>
  );
}
