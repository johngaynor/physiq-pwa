"use client";
import React from "react";
import PageTemplate from "@/app/components/Page/PageTemplate";
import WeightLog from "./index";

export default function Page() {
  return (
    <PageTemplate title="Weight Log">
      <WeightLog />
    </PageTemplate>
  );
}
