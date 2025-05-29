import React from "react";
import { Button, H1, H5 } from "@/components/ui";
import { CirclePlus } from "lucide-react";

type DashboardButtonProps = {
  header?: string;
  subheader?: string;
  data?: string | number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const DashboardButton = React.forwardRef<
  HTMLButtonElement,
  DashboardButtonProps
>(({ header = "--", subheader = "--", data }, ref) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 p-2">
        <Button
          variant="outline"
          className="w-full h-full flex flex-col relative"
          ref={ref}
        >
          <p className="absolute left-2 top-2 text-gray-500">{header}</p>
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
        </Button>
      </div>
      <div className="pt-[100%]" />
    </div>
  );
});
