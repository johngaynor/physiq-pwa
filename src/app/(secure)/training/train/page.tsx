import React from "react";
import PageTemplate from "../../components/Templates/PageTemplate";
import Training from "./index";

const title = "Training";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <Training />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
