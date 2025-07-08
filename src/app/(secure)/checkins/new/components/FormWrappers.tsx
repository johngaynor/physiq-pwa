import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { H3, Label } from "@/components/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function SectionWrapper({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className="w-full mb-4">
      <CardHeader className="flex w-full flex-row justify-between">
        <CardTitle>
          <H3>{title}</H3>
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

export function InputWrapper({
  children,
  error,
  tooltip,
  label,
  unit,
}: {
  children: React.ReactNode;
  error?: string;
  tooltip?: string;
  label?: string;
  unit?: string;
}) {
  return (
    <div className="grid w-full items-center gap-2 relative pb-3">
      <div className="flex gap-2">
        {label && (
          <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")}>
            {label} {unit && `(${unit})`}
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
      {children}
      {error && (
        <p className="text-sm text-red-500 absolute -bottom-4">{error}</p>
      )}
    </div>
  );
}
