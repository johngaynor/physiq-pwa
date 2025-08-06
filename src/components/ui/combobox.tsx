"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ComboboxOption {
  value: string;
  label: string;
  [key: string]: any; // Allow additional properties for custom components
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  optionComponent?: React.ComponentType<{
    option: ComboboxOption;
    isSelected: boolean;
  }>;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  className,
  optionComponent: OptionComponent,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) => {
      const labelMatch = option.label
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const descriptionMatch =
        option.description && typeof option.description === "string"
          ? option.description.toLowerCase().includes(searchTerm.toLowerCase())
          : false;
      const tagMatch =
        option.tags && Array.isArray(option.tags)
          ? option.tags.some((tag: string) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : false;
      return labelMatch || descriptionMatch || tagMatch;
    });
  }, [options, searchTerm]);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (option: ComboboxOption) => {
    onValueChange?.(option.value);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn(
          "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50 w-full justify-between gap-2 bg-transparent text-sm whitespace-nowrap cursor-pointer",
          !selectedOption && "text-muted-foreground"
        )}
        onClick={() => setOpen(!open)}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 absolute z-50 w-full mt-1 rounded-md border shadow-md max-h-60 overflow-auto">
          <div className="p-2">
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="p-1">
            {filteredOptions.length === 0 ? (
              <div className="text-muted-foreground px-2 py-1.5 text-sm">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-pointer items-start gap-2 rounded-sm py-2 px-2 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground",
                    value === option.value &&
                      "bg-accent text-accent-foreground font-medium"
                  )}
                  onClick={() => handleSelect(option)}
                >
                  {OptionComponent ? (
                    <OptionComponent
                      option={option}
                      isSelected={value === option.value}
                    />
                  ) : (
                    option.label
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
