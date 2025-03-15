import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PlaceholderInputProps {
  name: string;
  placeholder: string;
  value: string | number;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  [x: string]: any; // For additional props
}

// Custom Input with placeholder behavior - Fix duplicate errors
export const PlaceholderInput = ({
  name,
  placeholder,
  value,
  type = "text",
  onChange,
  onBlur,
  error,
  ...props
}: PlaceholderInputProps) => {
  const [focused, setFocused] = useState(false);
  const isPlaceholderShown = !value && !focused;
  
  const handleFocus = () => {
    setFocused(true);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };
  
  return (
    <div className="w-full">
      <input
        type={type}
        name={name}
        value={value || ""}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`mt-1 block w-full rounded border bg-background px-3 py-2
          ${error ? "border-destructive" : "border-input"} 
          ${isPlaceholderShown ? "text-foreground/50" : "text-foreground"}`}
        {...props}
      />
      {/* Remove error display from here - it will be shown by FormField instead */}
    </div>
  );
};

interface PlaceholderTextareaProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  rows?: number;
  [x: string]: any; // For additional props
}

// Custom Textarea with placeholder behavior - Fix duplicate errors
export const PlaceholderTextarea = ({
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  rows = 4,
  ...props
}: PlaceholderTextareaProps) => {
  const [focused, setFocused] = useState(false);
  const isPlaceholderShown = !value && !focused;
  
  const handleFocus = () => {
    setFocused(true);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };
  
  return (
    <div className="w-full">
      <textarea
        name={name}
        rows={rows}
        value={value || ""}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`mt-1 block w-full rounded bg-background border px-3 py-2
          ${error ? "border-destructive" : "border-input"} 
          ${isPlaceholderShown ? "text-foreground/50" : "text-foreground"}`}
        {...props}
      />
      {/* Remove error display from here - it will be shown by FormField instead */}
    </div>
  );
};

interface SectionButtonProps {
  section: { id: string; label: string };
  active: string;
  completed?: boolean;
  onClick: (id: string) => void;
}

// Section navigation button
export const SectionButton = ({ section, active, completed, onClick }: SectionButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick(section.id)}
      className={`w-full text-left px-4 py-2 rounded flex items-center justify-between ${
        active === section.id
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <span>{section.label}</span>
      {completed && <CheckCircle2 className="h-4 w-4 text-green-500" />}
    </button>
  );
};

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
}

// Form section wrapper
export const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <div className="space-y-6">
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      {children}
    </div>
  );
};

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

// Form field wrapper (for labels, errors, etc.)
export const FormField = ({ label, required, error, children }: FormFieldProps) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">
          {label}{" "}{required && <span className="text-destructive">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
