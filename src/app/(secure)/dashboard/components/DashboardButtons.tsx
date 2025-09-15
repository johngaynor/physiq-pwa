import React from "react";
import { H1, H5, Skeleton } from "@/components/ui";
import { CirclePlus } from "lucide-react";

type DashboardButtonSmallProps = {
  header?: string;
  subheader?: string;
  data?: string | number | null;
  onClick?: () => void;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const DashboardButtonSmall = React.forwardRef<
  HTMLButtonElement,
  DashboardButtonSmallProps
>(
  (
    { header = "--", subheader = "--", data, onClick, loading, ...props },
    ref
  ) => {
    if (loading) {
      return (
        <button className="relative w-full cursor-pointer">
          <div className="absolute inset-0">
            <div className="w-full h-full flex flex-col items-center justify-center border rounded-md bg-background hover:bg-accent transition">
              <Skeleton className="absolute left-3 top-3 h-6 w-20" />
              <Skeleton className="h-16 w-16 mt-8" />
              <Skeleton className="h-4 w-28 mt-2" />
            </div>
          </div>
          <div className="pt-[100%]" />
        </button>
      );
    } else
      return (
        <button
          ref={ref}
          {...props}
          className="relative w-full cursor-pointer"
          onClick={onClick}
        >
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
  }
);
DashboardButtonSmall.displayName = "DashboardButtonSmall";

type DashboardButtonLargeProps = {
  label: string;
  header: string;
  subheader?: string;
  onClick?: () => void;
  size?: "small" | "large";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const DashboardButtonLarge = React.forwardRef<
  HTMLButtonElement,
  DashboardButtonLargeProps
>(
  (
    { label, header, subheader = "--", onClick, size = "large", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        {...props}
        className={`relative ${
          size === "large" ? "h-full" : "h-48"
        } w-full border-2 rounded-md flex justify-center items-center bg-background hover:bg-accent transition padding-4 cursor-pointer`}
        onClick={onClick}
      >
        <div className="w-full h-full flex flex-col items-center justify-center border rounded-md bg-background hover:bg-accent transition p-4">
          <p className="absolute left-5 top-3 text-gray-500">{label}</p>
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p>{header}</p>
              <p className="text-sm mt-1">{subheader}</p>
            </div>
          </div>
        </div>
      </button>
    );
  }
);
DashboardButtonLarge.displayName = "DashboardButtonLarge";
