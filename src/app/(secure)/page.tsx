"use client";
import React from "react";
import PageTemplate from "@/app/(secure)/components/Templates/PageTemplate";
import Dashboard from "./index";

export default function Page() {
  return (
    <PageTemplate title="Weight Log">
      <Dashboard />
    </PageTemplate>
  );
}
