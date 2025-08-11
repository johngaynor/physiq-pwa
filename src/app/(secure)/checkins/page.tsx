import React from "react";
import PageTemplate from "../components/Templates/PageTemplate";
import CheckInsDashboard from "./index";

const title = "Check Ins";

export default function Page() {
  return (
    <PageTemplate title={title} showTitleMobile>
      <CheckInsDashboard />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
