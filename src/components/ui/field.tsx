import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { Input } from "@/components/ui/input";
import { SelectInput as RadixSelectInput } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FieldShellProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function FieldShell({ label, hint, children }: FieldShellProps) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="flex items-center gap-2 text-sm font-medium leading-none text-slate-900">
        {label}
      </span>
      {children}
      {hint && <span className="block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <Input className={className} {...props} />;
}

export function SelectInput({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <RadixSelectInput className={className} {...props} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <Textarea className={className} {...props} />;
}
