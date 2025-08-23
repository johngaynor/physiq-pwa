import React from "react";
import { Skeleton } from "@/components/ui";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function GymLoadingPage() {
  return (
    <Card className="w-full rounded-sm p-0 mb-20">
      <CardContent className="flex flex-col md:flex-row justify-between grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div>
          <Skeleton className="h-72 w-full" />
        </div>
        <div>
          <div className="mb-6 flex justify-between items-center">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="py-8">
            <Skeleton className="h-6 w-1/6 mb-4" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0 flex flex-col">
        <div className="border-t-1 h-12 w-full flex items-center justify-between px-4">
          <Skeleton className="h-6 w-1/6" />
          <Skeleton className="h-6 w-6" />
        </div>
        <div className="border-t-1 h-12 w-full flex items-center justify-between px-4">
          <Skeleton className="h-6 w-1/6" />
          <Skeleton className="h-6 w-6" />
        </div>
      </CardFooter>
    </Card>
  );
}
