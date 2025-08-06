import React from "react";
import { Badge } from "@/components/ui/badge";

interface SupplementOptionProps {
  option: {
    value: string;
    label: string;
    description?: string;
    tags?: string[];
  };
  isSelected: boolean;
}

export const SupplementOption: React.FC<SupplementOptionProps> = ({
  option,
}) => {
  return (
    <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[20fr_60fr_20fr] gap-2 w-full items-start">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-start">{option.label}</div>
      </div>
      <div className="hidden md:flex md:flex-1 min-w-0">
        {option.description && (
          <div className="text-xs text-muted-foreground truncate">
            {option.description}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        {option.tags && option.tags.length > 0 && (
          <div className="flex flex-col gap-1 shrink-0">
            <div className="flex gap-1 flex-wrap justify-end">
              {option.tags.slice(0, 2).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-1 py-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {option.tags.length > 2 && (
              <div className="flex justify-end">
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  +{option.tags.length - 2}
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
