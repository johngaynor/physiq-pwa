import React from "react";
import PageTemplate from "../components/Templates/PageTemplate";
import DietDashboard from "./index";

const title = "Diet";

export default function Page() {
  return (
    <PageTemplate title={title} showTitleMobile>
      <DietDashboard />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
