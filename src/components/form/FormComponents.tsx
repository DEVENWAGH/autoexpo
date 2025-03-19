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

// Process the placeholder text to display newlines properly
const processPlaceholder = (placeholder: string | undefined): string => {
  if (!placeholder) return "";

  // Replace \n with actual line breaks for display
  return placeholder.replace(/\\n/g, "\n");
};

export const PlaceholderInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(({ className, error, placeholder, onChange, onKeyDown, ...props }, ref) => {
  // Process placeholder for display
  const displayPlaceholder = processPlaceholder(placeholder as string);

  // Handle tab key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If Tab key is pressed and the input is empty
    if (e.key === "Tab") {
      const input = e.target as HTMLInputElement;
      if ((!input.value || input.value === "") && placeholder) {
        // Prevent default to stop tab navigation
        e.preventDefault();

        // Process placeholder - replace escaped newlines with actual newlines
        const processedPlaceholder = placeholder
          .toString()
          .replace(/\\n/g, "\n");

        // Set input value to the placeholder
        if (onChange) {
          const syntheticEvent = {
            target: {
              value: processedPlaceholder,
              name: input.name,
            },
          } as React.ChangeEvent<HTMLInputElement>;

          onChange(syntheticEvent);
        }

        // Find next focusable element and focus it manually
        const focusableElements =
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const allFocusable = Array.from(
          document.querySelectorAll(focusableElements)
        );
        const currentIndex = allFocusable.indexOf(input);
        const nextElement = allFocusable[currentIndex + 1] as HTMLElement;

        if (nextElement) {
          nextElement.focus();
        }
      }
    }

    // Call the original onKeyDown if provided
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <input
      ref={ref}
      className={cn(
        "mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2",
        error && "border-destructive",
        className
      )}
      placeholder={displayPlaceholder}
      onKeyDown={handleKeyDown}
      onChange={onChange}
      {...props}
    />
  );
});

PlaceholderInput.displayName = "PlaceholderInput";

export const PlaceholderTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
>(({ className, error, placeholder, onChange, onKeyDown, ...props }, ref) => {
  // Process placeholder for display
  const displayPlaceholder = processPlaceholder(placeholder as string);

  // Handle tab key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If Tab key is pressed and the textarea is empty
    if (e.key === "Tab") {
      const textarea = e.target as HTMLTextAreaElement;
      if ((!textarea.value || textarea.value === "") && placeholder) {
        // Prevent default to stop tab navigation
        e.preventDefault();

        // Process placeholder - replace escaped newlines with actual newlines
        const processedPlaceholder = placeholder
          .toString()
          .replace(/\\n/g, "\n");

        // Set textarea value to the processed placeholder
        if (onChange) {
          const syntheticEvent = {
            target: {
              value: processedPlaceholder,
              name: textarea.name,
            },
          } as React.ChangeEvent<HTMLTextAreaElement>;

          onChange(syntheticEvent);
        }

        // Find next focusable element and focus it manually
        const focusableElements =
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const allFocusable = Array.from(
          document.querySelectorAll(focusableElements)
        );
        const currentIndex = allFocusable.indexOf(textarea);
        const nextElement = allFocusable[currentIndex + 1] as HTMLElement;

        if (nextElement) {
          nextElement.focus();
        }
      }
    }

    // Call the original onKeyDown if provided
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <textarea
      ref={ref}
      rows={4}
      className={cn(
        "mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2",
        error && "border-destructive",
        className
      )}
      placeholder={displayPlaceholder}
      onKeyDown={handleKeyDown}
      onChange={onChange}
      {...props}
    />
  );
});

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
