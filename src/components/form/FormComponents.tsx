import React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  required = false,
  error,
  className,
}) => (
  <div className={cn("space-y-2", className)}>
    <label className="block text-sm font-medium text-foreground">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

export const PlaceholderInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2",
      error && "border-destructive",
      className
    )}
    {...props}
  />
));

PlaceholderInput.displayName = "PlaceholderInput";

export const PlaceholderTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={4}
    className={cn(
      "mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2",
      error && "border-destructive",
      className
    )}
    {...props}
  />
));

PlaceholderTextarea.displayName = "PlaceholderTextarea";

interface SectionButtonProps {
  section: {
    id: string;
    label: string;
  };
  active: string;
  completed?: boolean;
  onClick: (id: string) => void;
}

export const SectionButton: React.FC<SectionButtonProps> = ({
  section,
  active,
  completed,
  onClick,
}) => {
  const isActive = section.id === active;

  return (
    <button
      type="button"
      onClick={() => onClick(section.id)}
      className={cn(
        "w-full text-left px-3 py-2 rounded text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "hover:bg-muted",
        completed && !isActive && "text-green-600"
      )}
    >
      <div className="flex items-center gap-2">
        {completed ? (
          <div className="h-2 w-2 rounded-full bg-green-500" />
        ) : (
          <div className="h-2 w-2 rounded-full bg-gray-300" />
        )}
        {section.label}
      </div>
    </button>
  );
};
