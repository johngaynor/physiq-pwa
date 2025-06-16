import React from "react";
import PageTemplate from "../components/Templates/PageTemplate";
import HealthDashboard from "./index";

const title = "Health Metrics";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <HealthDashboard />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
