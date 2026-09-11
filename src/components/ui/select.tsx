"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const emptyOptionValue = "__life_os_empty_option__";

type SelectOption = {
  disabled: boolean;
  label: string;
  value: string;
};

type SelectInputProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  placeholder?: string;
};

function getOptions(children: React.ReactNode): SelectOption[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<React.OptionHTMLAttributes<HTMLOptionElement>>(child)) {
      return [];
    }

    const value = String(child.props.value ?? "");
    const label = React.Children.toArray(child.props.children).join("");

    return [{ disabled: Boolean(child.props.disabled), label, value }];
  });
}

function toStringValue(value: string | number | readonly string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : value === undefined ? "" : String(value);
}

export function SelectInput({
  children,
  className,
  defaultValue,
  disabled,
  id,
  name,
  onChange,
  placeholder,
  required,
  value,
  ...triggerProps
}: SelectInputProps) {
  const options = getOptions(children);
  const isControlled = value !== undefined;
  const defaultSelectedValue = toStringValue(defaultValue) || options[0]?.value || "";
  const [internalValue, setInternalValue] = React.useState(defaultSelectedValue);
  const selectedValue = isControlled ? toStringValue(value) : internalValue;

  function handleValueChange(nextValue: string) {
    const next = nextValue === emptyOptionValue ? "" : nextValue;

    if (!isControlled) {
      setInternalValue(next);
    }

    onChange?.({
      currentTarget: { name, value: next },
      target: { name, value: next },
    } as React.ChangeEvent<HTMLSelectElement>);
  }

  return (
    <SelectPrimitive.Root
      disabled={disabled}
      onValueChange={handleValueChange}
      value={selectedValue === "" ? emptyOptionValue : selectedValue}
    >
      {name && <input disabled={disabled} name={name} type="hidden" value={selectedValue} />}
      <SelectPrimitive.Trigger
        aria-required={required || undefined}
        className={cn(
          "flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-left text-sm text-slate-900 shadow-sm outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-emerald-600 focus-visible:ring-[3px] focus-visible:ring-emerald-600/25",
          "aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-[3px] aria-[invalid=true]:ring-red-500/20",
          className
        )}
        data-slot="select-trigger"
        id={id}
        {...(triggerProps as React.ComponentProps<typeof SelectPrimitive.Trigger>)}
      >
        <SelectPrimitive.Value placeholder={placeholder ?? "Select an option"} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-slate-500" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="z-[100] max-h-80 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-900 shadow-lg"
          position="popper"
        >
          <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1 text-slate-500">
            <ChevronUp aria-hidden="true" className="size-4" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => {
              const radixValue = option.value === "" ? emptyOptionValue : option.value;

              return (
                <SelectPrimitive.Item
                  className="relative flex cursor-pointer select-none items-center rounded-sm py-2 pr-8 pl-2 text-sm outline-none data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-800 data-[state=checked]:font-medium data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  disabled={option.disabled}
                  key={radixValue}
                  value={radixValue}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-2 inline-flex items-center">
                    <Check aria-hidden="true" className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              );
            })}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1 text-slate-500">
            <ChevronDown aria-hidden="true" className="size-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
