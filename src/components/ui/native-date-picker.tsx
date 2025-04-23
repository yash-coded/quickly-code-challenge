"use client";

import * as React from "react";
import { parseISO, format } from "date-fns";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface NativeDatePickerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  className?: string;
  wrapperClassName?: string;
}

export function NativeDatePicker({
  date,
  setDate,
  label,
  className,
  wrapperClassName,
  ...props
}: NativeDatePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setDate(undefined);
      return;
    }

    // Parse the value to get a date in the user's local timezone
    const selectedDate = parseISO(e.target.value);
    setDate(selectedDate);
  };

  // Format date as ISO for the input value (YYYY-MM-DD)
  const inputValue = date ? format(date, "yyyy-MM-dd") : "";

  const displayValue = date ? format(date, "PPP") : "Pick a date";

  return (
    <div className={cn("grid gap-2", wrapperClassName)}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <div
          onClick={() => inputRef.current?.showPicker()}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer items-center",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span>{displayValue}</span>
        </div>

        {/* Actual date input - visually hidden but still functional */}
        <input
          ref={inputRef}
          type="date"
          value={inputValue}
          onChange={handleChange}
          className="sr-only" // Screen reader only - visually hidden
          tabIndex={-1}
          {...props}
        />
      </div>
    </div>
  );
}
