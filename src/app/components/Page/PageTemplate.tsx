"use client";
import React from "react";
import { H3 } from "@/components/ui";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
        <H3 className="py-4 align-left md:w-auto w-full">{title}</H3>
        <div className="text-md text-muted-foreground pt-2 pl-3 md:block hidden">
          {segments.map((segment, idx) => {
            const href = "/" + segments.slice(0, idx + 1).join("/");
            return (
              <span key={idx}>
                {idx > 0 && " / "}
                <Link
                  href={href}
                  className="capitalize underline text-muted-foreground hover:text-white hover:decoration-white"
                >
                  {segment}
                </Link>
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">{children}</div>
    </div>
  );
}
