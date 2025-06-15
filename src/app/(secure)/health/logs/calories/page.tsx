"use client";
import React from "react";
import PageTemplate from "@/app/(secure)/components/Templates/PageTemplate";
import CalorieLog from "@/app/(secure)/health/logs/calories";

export default function Page() {
  return (
    <PageTemplate title="Caloric Intake Log">
      <CalorieLog />
    </PageTemplate>
  );
}
