"use client";
import React from "react";
import PageTemplate from "@/app/(secure)/components/Templates/PageTemplate";
import BodyfatLog from "@/app/(secure)/health/logs/bodyfat";

export default function Page() {
  return (
    <PageTemplate title="Bodyfat Log" showTitleMobile>
      <BodyfatLog />
    </PageTemplate>
  );
}
