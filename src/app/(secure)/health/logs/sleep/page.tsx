"use client";
import React from "react";
import PageTemplate from "@/app/(secure)/components/Templates/PageTemplate";
import SleepLog from "@/app/(secure)/health/logs/sleep";

export default function Page() {
  return (
    <PageTemplate title="Sleep Log">
      <SleepLog />
    </PageTemplate>
  );
}
