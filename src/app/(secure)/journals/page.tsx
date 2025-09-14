import React from "react";
import PageTemplate from "../components/Templates/PageTemplate";
import Journals from "./index";

const title = "Journals";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <Journals />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
