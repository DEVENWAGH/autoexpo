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
}) => {
  const {
    register,
    formState: { errors },
    customSetValue,
  } = useCarForm();
  const fieldPath = `${section}.${field}`;
  const error = errors[section]?.[field];

  // Render different input types based on the type prop
  const renderInput = () => {
    if (children) return children;

    if (type === "select" && options) {
      return (
        <select
          id={fieldPath}
          {...register(fieldPath as any)}
          onChange={(e) =>
            customSetValue(section as any, field, e.target.value)
          }
          className={cn(
            "mt-1 block w-full rounded border border-input bg-background px-3 py-2",
            error && "border-destructive"
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
          onChange={(e) =>
            customSetValue(section as any, field, e.target.checked)
          }
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
          onChange={(e) =>
            customSetValue(section as any, field, e.target.value)
          }
          placeholder={placeholder}
          rows={4}
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
        onChange={(e) => customSetValue(section as any, field, e.target.value)}
        placeholder={placeholder}
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
