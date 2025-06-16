"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2 border-b", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative", // Needed for positioning the `::after` underline
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
        "text-foreground dark:text-muted-foreground dark:hover:bg-input/30 dark:hover:text-primary",
        "inline-flex h-[calc(100%-1px)] mb-2 flex-1 items-center justify-center gap-1.5",
        "rounded-md border border-transparent px-4 py-1 text-sm font-medium whitespace-nowrap",
        "transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1",
        "disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // The underline using ::after
        "data-[state=active]:after:content-[''] data-[state=active]:after:absolute",
        "data-[state=active]:after:bottom-[-7px] data-[state=active]:after:left-1/2",
        "data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:w-full",
        "data-[state=active]:after:h-0.5 data-[state=active]:after:bg-white",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
