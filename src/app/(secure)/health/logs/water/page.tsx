"use client";
import React from "react";
import PageTemplate from "@/app/(secure)/components/Templates/PageTemplate";
import WaterLog from "@/app/(secure)/health/logs/water";

export default function Page() {
  return (
    <PageTemplate title="Water Intake Log">
      <WaterLog />
    </PageTemplate>
  );
}
