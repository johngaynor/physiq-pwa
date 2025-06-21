import React from "react";
import PageTemplate from "../../../components/Templates/PageTemplate";
import DietLog from "./index";

const title = "Diet";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <DietLog />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
