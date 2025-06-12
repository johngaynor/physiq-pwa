"use client";
import React from "react";
import { H3 } from "@/components/ui";
import { usePathname } from "next/navigation";

type PageTemplateProps = {
  title: string;
  children: React.ReactNode;
};

export default function PageTemplate({ children, title }: PageTemplateProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (pathname === "/") segments.push("Dashboard");

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center">
        <H3 className="py-4">{title}</H3>
        <div className="text-md text-muted-foreground pt-2 pl-3 md:block hidden">
          {segments.map((segment, idx) => (
            <span key={idx}>
              {idx > 0 && " / "}
              <span className="capitalize">{segment}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">{children}</div>
    </div>
  );
}
