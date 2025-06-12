import React from "react";
import HealthPage from "./index";
import PageTemplate from "../../components/Page";

const title = "Health Apps";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <HealthPage />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
