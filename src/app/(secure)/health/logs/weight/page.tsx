"use client";
import React from "react";
import PageTemplate from "@/app/(secure)/components/Templates/PageTemplate";
import WeightLog from "./index";

export default function Page() {
  return (
    <PageTemplate title="Weight Log">
      <WeightLog />
    </PageTemplate>
  );
}
