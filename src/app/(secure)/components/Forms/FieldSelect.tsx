import React from "react";
import { Label } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface SelectOption {
  value: string | number;
  text: string;
}

interface FieldSelectProps {
  label?: string;
  labelStyles?: string;
  selectId?: string;
  selectStyles?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder: string;
  options: SelectOption[];
  disabled?: boolean;
  tooltip?: string;
}

export function FieldSelect({
  label,
  labelStyles,
  selectId,
  selectStyles,
  placeholder,
  value,
  onChange,
  options,
  disabled = false,
  tooltip,
}: FieldSelectProps) {
  // Convert value to string for the Select component
  const stringValue = String(value);

  // Handle change with conversion back to original type
  const handleChange = (selectedValue: string) => {
    // Find the original option to determine if we should return string or number
    const originalOption = options.find(
      (opt) => String(opt.value) === selectedValue
    );
    if (originalOption) {
      onChange(originalOption.value);
    }
  };

  return (
    <div className="grid w-full items-center gap-2">
      <div className="flex gap-2">
        {label && (
          <Label htmlFor={selectId} className={labelStyles}>
            {label}
          </Label>
        )}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-200 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Select
        onValueChange={handleChange}
        value={stringValue}
        disabled={disabled}
      >
        <SelectTrigger className={`w-full ${selectStyles || ""}`} id={selectId}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.value)}>
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
