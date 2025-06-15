"use client";
import React from "react";
import PageTemplate from "./components/Templates/PageTemplate";
import Dashboard from "./index";

export default function Page() {
  return (
    <PageTemplate title="Today">
      <Dashboard />
    </PageTemplate>
  );
}
