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
import { Badge } from "@/components/ui/badge";

const GYM_TAGS = [
  {
    value: "cardio-equipment",
    label: "Cardio Equipment",
  },
  {
    value: "free-weights",
    label: "Free Weights",
  },
  {
    value: "weight-machines",
    label: "Weight Machines",
  },
  {
    value: "group-classes",
    label: "Group Classes",
  },
  {
    value: "personal-training",
    label: "Personal Training",
  },
  {
    value: "swimming-pool",
    label: "Swimming Pool",
  },
  {
    value: "sauna",
    label: "Sauna",
  },
  {
    value: "steam-room",
    label: "Steam Room",
  },
  {
    value: "basketball-court",
    label: "Basketball Court",
  },
  {
    value: "racquetball-court",
    label: "Racquetball Court",
  },
  {
    value: "rock-climbing",
    label: "Rock Climbing",
  },
  {
    value: "yoga-studio",
    label: "Yoga Studio",
  },
  {
    value: "cycling-studio",
    label: "Cycling Studio",
  },
  {
    value: "locker-rooms",
    label: "Locker Rooms",
  },
  {
    value: "parking",
    label: "Parking",
  },
  {
    value: "wifi",
    label: "WiFi",
  },
  {
    value: "towel-service",
    label: "Towel Service",
  },
  {
    value: "massage-therapy",
    label: "Massage Therapy",
  },
  {
    value: "childcare",
    label: "Childcare",
  },
  {
    value: "24-hour-access",
    label: "24 Hour Access",
  },
  {
    value: "juice-bar",
    label: "Juice Bar",
  },
  {
    value: "pro-shop",
    label: "Pro Shop",
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

  const handleRemoveTag = (tagValue: string) => {
    const newValue = value.filter((v) => v !== tagValue);
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
