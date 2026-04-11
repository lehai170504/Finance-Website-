// components/ui/date-picker-input.tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DatePickerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const DatePickerInput = React.forwardRef<
  HTMLInputElement,
  DatePickerInputProps
>(({ className, ...props }, ref) => {
  return (
    <div className="relative group w-full">
      <Input
        type="date"
        ref={ref}
        className={cn(
          "font-bold relative z-10 bg-transparent cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer uppercase",
          className,
        )}
        {...props}
      />
      <CalendarIcon
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground z-0 transition-colors group-focus-within:text-primary group-hover:text-primary pointer-events-none"
        size={16}
      />
    </div>
  );
});

DatePickerInput.displayName = "DatePickerInput";

export { DatePickerInput };
