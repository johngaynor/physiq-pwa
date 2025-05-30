import React from "react";
import { H1, H5 } from "@/components/ui";
import { CirclePlus } from "lucide-react";

type DashboardButtonProps = {
  header?: string;
  subheader?: string;
  data?: string | number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const DashboardButton = React.forwardRef<
  HTMLButtonElement,
  DashboardButtonProps
>(({ header = "--", subheader = "--", data, ...props }, ref) => {
  return (
    <button ref={ref} {...props} className="relative w-full">
      <div className="absolute inset-0">
        <div className="w-full h-full flex flex-col items-center justify-center border rounded-md bg-background hover:bg-accent transition">
          <p className="absolute left-5 top-3 text-gray-500">{header}</p>
          {data ? (
            <>
              <H1>{data}</H1>
              <H5>{subheader}</H5>
            </>
          ) : (
            <>
              <CirclePlus className="size-12 font-extrabold" />
              <H5>Record {header}</H5>
            </>
          )}
        </div>
      </div>
      <div className="pt-[100%]" />
    </button>
  );
});
DashboardButton.displayName = "DashboardButton";
