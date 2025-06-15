import React from "react";
import { Skeleton } from "@/components/ui";

export default function LogsLoadingPage() {
  return (
    <div className="flex w-full md:flex-row flex-col pb-10">
      <div className="flex flex-col space-y-3 w-full md:w-[250px]">
        <Skeleton className="h-[340px] w-full rounded-xl" />
        <Skeleton className="h-[50px] w-full rounded-xl" />
      </div>
      <div className="md:flex-1 md:pl-4 md:pt-0 pt-8 h-[400px] w-full">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>
    </div>
  );
}
