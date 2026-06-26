import { InputHTMLAttributes, SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs font-semibold text-rose-600">{error}</span> : null}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn("h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-primary/20 transition focus:ring-4", className)}
    {...props}
  />
));
Input.displayName = "Input";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn("h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-primary/20 transition focus:ring-4", className)}
    {...props}
  />
));
Select.displayName = "Select";
