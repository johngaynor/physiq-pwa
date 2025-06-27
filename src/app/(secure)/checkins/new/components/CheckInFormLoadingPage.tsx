import React from "react";
import { Skeleton } from "@/components/ui";

export default function CheckInFormLoadingPage() {
  return (
    <div className="w-full">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-[175px] overflow-hidden w-full border-2 rounded-lg mb-4"
        >
          <div className="flex flex-row justify-between items-center">
            <Skeleton className="h-6 w-1/3 m-4" />
            <Skeleton className="h-6 w-1/6 m-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, subIndex) => (
              <div className="m-4 flex flex-col" key={index + "-" + subIndex}>
                <Skeleton className="h-6 w-1/6 mb-2" />
                <Skeleton className="h-10 w-full mb-2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
