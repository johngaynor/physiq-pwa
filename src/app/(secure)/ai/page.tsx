import React from "react";
import PageTemplate from "../components/Templates/PageTemplate";
import AppsGrid from "@/app/components/Page/AppsGrid";

const title = "AI";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <AppsGrid filter="/ai" />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
