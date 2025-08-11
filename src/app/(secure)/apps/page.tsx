import React from "react";
import PageTemplate from "../components/Templates/PageTemplate";
import AppsGrid from "@/app/components/Page/AppsGrid";

const title = "All Applications";

export default function Page() {
  return (
    <PageTemplate title={title} showTitleMobile>
      <AppsGrid filter="" />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
