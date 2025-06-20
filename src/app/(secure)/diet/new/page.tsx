import React from "react";
import PageTemplate from "../../components/Templates/PageTemplate";
import DietLogForm from "./index";

const title = "New Diet Log";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <DietLogForm />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
