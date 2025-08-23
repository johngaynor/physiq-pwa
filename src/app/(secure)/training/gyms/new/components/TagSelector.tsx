"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const GYM_TAGS = [
  {
    value: "bodybuilding",
    label: "bodybuilding",
  },
  {
    value: "powerlifting",
    label: "powerlifting",
  },
  {
    value: "pool",
    label: "pool",
  },
  {
    value: "cardio",
    label: "cardio",
  },
  {
    value: "24/7",
    label: "24/7",
  },
  {
    value: "day passes",
    label: "day passes",
  },
  {
    value: "local gym",
    label: "local gym",
  },
  {
    value: "commercial gym",
    label: "commercial gym",
  },
  {
    value: "expensive",
    label: "expensive",
  },
  {
    value: "sauna",
    label: "sauna",
  },
  {
    value: "steam room",
    label: "steam room",
  },
  {
    value: "posing room",
    label: "posing room",
  },
  {
    value: "yoga room",
    label: "yoga room",
  },
];

interface TagSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

export function TagSelector({ value = [], onChange }: TagSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const handleToggleTag = (tagValue: string) => {
    const newValue = value.includes(tagValue)
      ? value.filter((v) => v !== tagValue)
      : [...value, tagValue];
    onChange?.(newValue);
  };

  return (
    <div>
      {/* Tag selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className={value.length > 0 ? "" : "text-muted-foreground"}>
              {value.length > 0
                ? `${value.length} tag${value.length === 1 ? "" : "s"} selected`
                : "Select gym tags..."}
            </span>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search gym amenities..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {GYM_TAGS.map((tag) => (
                  <CommandItem
                    key={tag.value}
                    value={tag.value}
                    onSelect={() => handleToggleTag(tag.value)}
                  >
                    {tag.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value.includes(tag.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
