import React from "react";
import { Label, Input } from "@/components/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface FieldInputProps {
  label?: string;
  labelStyles?: string;
  inputId: string;
  inputStyles?: string;
  value: string | number;
  onChange: (data: { key: string; value: string | number }) => void;
  placeholder: string;
  type: string;
  tooltip?: string;
}

export function FieldInput({
  label,
  labelStyles,
  inputId,
  inputStyles,
  placeholder,
  type,
  value,
  onChange,
  tooltip,
}: FieldInputProps) {
  return (
    <div className="grid w-full items-center gap-2">
      <div className="flex gap-2">
        {label && (
          <Label htmlFor={inputId} className={labelStyles}>
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
      <Input
        id={inputId}
        type={type}
        value={value}
        className={inputStyles}
        placeholder={placeholder}
        onChange={(e) => {
          const inputValue =
            type === "number" ? Number(e.target.value) : e.target.value;
          onChange({ key: inputId, value: inputValue });
        }}
      />
    </div>
  );
}
