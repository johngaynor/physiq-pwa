import React from "react";
import PageTemplate from "../../../../components/Templates/PageTemplate";
import SupplementFormWrapper from "./index";

const title = "New Supplement";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <SupplementFormWrapper />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
