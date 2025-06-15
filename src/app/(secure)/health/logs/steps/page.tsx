"use client";
import React from "react";
import PageTemplate from "@/app/(secure)/components/Templates/PageTemplate";
import StepsLog from "@/app/(secure)/health/logs/steps";

export default function Page() {
  return (
    <PageTemplate title="Steps Log">
      <StepsLog />
    </PageTemplate>
  );
}
