import React from "react";
import { useCarForm } from "@/store/useCarStore";
import { cn } from "@/lib/utils";

interface VehicleFormFieldProps {
  section: string;
  field: string;
  label: string;
  type?: string;
  required?: boolean;
  children?: React.ReactNode;
  placeholder?: string;
  options?: string[];
  value?: string | number | boolean;
  disabled?: boolean;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export const VehicleFormField: React.FC<VehicleFormFieldProps> = ({
  section,
  field,
  label,
  type = "text",
  required = false,
  children,
  placeholder,
  options,
  value,
  disabled = false,
  onChange,
}) => {
  const {
    register,
    formState: { errors },
    customSetValue,
    getValues,
  } = useCarForm();
  const fieldPath = `${section}.${field}`;
  const error = errors[section]?.[field];

  // Process placeholder for display
  const processPlaceholder = (text: string | undefined): string => {
    if (!text) return "";
    return text.replace(/\\n/g, "\n");
  };

  const displayPlaceholder = processPlaceholder(placeholder);

  // Create custom key handler specifically for tab key functionality
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // If Tab key is pressed and the input is empty
    if (e.key === "Tab") {
      const input = e.target as HTMLInputElement | HTMLTextAreaElement;
      if ((!input.value || input.value === "") && placeholder) {
        // Prevent the default tab behavior to avoid losing focus
        e.preventDefault();

        // Process placeholder - replace escaped newlines with actual newlines
        const processedPlaceholder = placeholder
          .toString()
          .replace(/\\n/g, "\n");

        // Set value using customSetValue
        customSetValue(section as any, field, processedPlaceholder);

        // Find the next focusable element and focus it
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
  };

  // Render different input types based on the type prop
  const renderInput = () => {
    if (children) return children;

    if (type === "select" && options) {
      return (
        <select
          id={fieldPath}
          {...register(fieldPath as any)}
          onChange={(e) => {
            customSetValue(section as any, field, e.target.value);
            // Call the external onChange handler if provided
            if (onChange) onChange(e);
          }}
          value={value !== undefined ? value : getValues(fieldPath)}
          disabled={disabled}
          className={cn(
            "mt-1 block w-full rounded border border-input bg-background px-3 py-2",
            error && "border-destructive",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <option value="">{`Select ${label}`}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          id={fieldPath}
          {...register(fieldPath as any)}
          onChange={(e) => {
            customSetValue(section as any, field, e.target.checked);
            // Call the external onChange handler if provided
            if (onChange) onChange(e);
          }}
          className={cn(
            "rounded border-input bg-background text-primary",
            error && "border-destructive"
          )}
        />
      );
    }

    if (type === "textarea") {
      return (
        <textarea
          id={fieldPath}
          {...register(fieldPath as any)}
          onChange={(e) => {
            customSetValue(section as any, field, e.target.value);
            // Call the external onChange handler if provided
            if (onChange) onChange(e);
          }}
          placeholder={displayPlaceholder}
          rows={4}
          onKeyDown={handleKeyDown}
          className={cn(
            "mt-1 block w-full rounded border border-input bg-background px-3 py-2",
            error && "border-destructive"
          )}
        />
      );
    }

    // Default text input
    return (
      <input
        type={type}
        id={fieldPath}
        {...register(fieldPath as any)}
        onChange={(e) => {
          customSetValue(section as any, field, e.target.value);
          // Call the external onChange handler if provided
          if (onChange) onChange(e);
        }}
        placeholder={displayPlaceholder}
        onKeyDown={handleKeyDown}
        className={cn(
          "mt-1 block w-full rounded border border-input bg-background px-3 py-2",
          error && "border-destructive"
        )}
      />
    );
  };

  return (
    <div className="space-y-2">
      <label htmlFor={fieldPath} className="block text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="text-xs text-destructive">{error.message as string}</p>
      )}
    </div>
  );
};
