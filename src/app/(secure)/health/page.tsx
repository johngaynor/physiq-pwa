import React from "react";
import PageTemplate from "../../components/Page/PageTemplate";
import AppsGrid from "@/app/components/Page/AppsGrid";

const title = "Health Apps";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <AppsGrid filter="/health" />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
