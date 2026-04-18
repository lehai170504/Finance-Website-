// components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border-2 bg-background/50 backdrop-blur-sm px-5 py-2 text-sm font-medium transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
          "border-border/60 hover:border-primary/40 focus-visible:border-primary focus-visible:bg-background focus-visible:ring-8 focus-visible:ring-primary/5",
          error &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/10",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
