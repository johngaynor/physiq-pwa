import React from "react";
import PageTemplate from "@/app/(secure)/components/Templates/PageTemplate";
import PoseDashboard from "./index";

const title = "Pose Classification";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <PoseDashboard />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
