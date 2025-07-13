import React from "react";
import PageTemplate from "../../../../components/Templates/PageTemplate";
import PhysiqueDashboard from "./index";

const title = "AI Training - Physique Poses";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <PhysiqueDashboard />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
