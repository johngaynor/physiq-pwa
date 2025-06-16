"use client";
import React from "react";
import { H1 } from "@/components/ui";
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
      <div className="border-b py-4 mb-6">
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto px-5">
          <H1 className="py-4 align-left md:w-auto w-full">{title}</H1>
          <div className="text-md text-muted-foreground pt-2 pl-3 md:block hidden">
            {segments.map((segment, idx) => {
              const href =
                segment === "Dashboard"
                  ? "/"
                  : "/" + segments.slice(0, idx + 1).join("/");
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
      </div>
      <div className="flex flex-col md:flex-row gap-4 max-w-6xl mx-auto px-5">
        {children}
      </div>
    </div>
  );
}
