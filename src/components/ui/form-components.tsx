import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const FormSelect = ({
  label,
  name,
  options,
  defaultValue = "",
  required = false,
}: {
  label: string;
  name: string;
  options: readonly string[];
  defaultValue?: string;
  required?: boolean;
}) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-sm font-medium text-gray-300">
      {label}
    </Label>
    <Select name={name} defaultValue={defaultValue}>
      <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export const FormInput = ({
  label,
  name,
  type = "text",
  defaultValue = "",
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  [key: string]: any;
}) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-sm font-medium text-gray-300">
      {label}
    </Label>
    <Input
      type={type}
      id={name}
      name={name}
      defaultValue={defaultValue}
      className="bg-gray-800 border-gray-700 text-white"
      {...props}
    />
  </div>
);

export const FormCheckbox = ({
  label,
  name,
  defaultChecked = true,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={name}
      name={name}
      defaultChecked={defaultChecked}
      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
    />
    <Label htmlFor={name} className="text-sm font-medium text-gray-300">
      {label}
    </Label>
  </div>
);
