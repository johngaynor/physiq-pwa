import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { H3 } from "@/components/ui";

export function SectionWrapper({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className="w-full dark:bg-[#060B1C] mb-4">
      <CardHeader className="flex w-full flex-row justify-between">
        <CardTitle>
          <H3>{title}</H3>
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

export function InputWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">{children}</div>
  );
}
