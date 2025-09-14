import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Individual journal skeleton component
const JournalSkeleton: React.FC = () => (
  <Card className="w-full flex flex-col" style={{ aspectRatio: "8.5/11" }}>
    <CardHeader className="pb-3 flex-shrink-0">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-20 mt-1" />
        </div>
        <Skeleton className="h-8 w-16 ml-2" />
      </div>
      <Skeleton className="h-4 w-32 mt-2" />
    </CardHeader>
    <CardContent className="pt-0 flex-1 flex flex-col justify-between">
      {/* Mini document preview skeleton */}
      <div className="flex-1 mb-3 border border-border rounded-sm bg-muted/30 p-2">
        <div className="space-y-1">
          <Skeleton className="h-2 w-3/4" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-5/6" />
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-1.5 w-4/5" />
          <Skeleton className="h-1.5 w-3/4" />
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-1.5 w-2/3" />
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center pt-3 border-t border-border">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-8" />
      </div>
    </CardContent>
  </Card>
);

// Main journals loading component
const JournalsLoading: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="w-full space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Search bar skeleton */}
      <div className="w-full max-w-md">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Journals grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, index) => (
          <JournalSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default JournalsLoading;
