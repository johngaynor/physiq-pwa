"use client";
import React from "react";
import { H4 } from "@/components/ui";
import { usePathname } from "next/navigation";

type PageTemplateProps = {
  title: string;
  children: React.ReactNode;
};

export default function PageTemplate({ children, title }: PageTemplateProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // Breadcrumb parts

  return (
    <div className="space-y-4">
      <H4 className="py-4">{title}</H4>
      <div className="text-sm text-muted-foreground">
        {segments.map((segment, idx) => (
          <span key={idx}>
            {idx > 0 && " / "}
            <span className="capitalize">{segment}</span>
          </span>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">{children}</div>
    </div>
  );
}
