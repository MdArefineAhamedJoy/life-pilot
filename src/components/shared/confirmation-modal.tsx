"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmationModalVariant = "default" | "destructive" | "danger";

type ConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmationModalVariant;
  onConfirm: () => void;
};

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
}: ConfirmationModalProps) {
  function handleConfirm() {
    onConfirm();
    onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="!w-[min(92vw,520px)] max-w-none gap-0 p-0" showCloseButton={false}>
        <div className="p-6 pb-5">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg leading-none">{title}</DialogTitle>
            <DialogDescription className="pt-2 leading-6">{description}</DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="px-6 pb-6">
          <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            type="button"
            variant={variant === "danger" || variant === "destructive" ? "danger" : "primary"}
          >
            {actionLabel ?? confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
