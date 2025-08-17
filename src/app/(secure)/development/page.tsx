import React from "react";
import PageTemplate from "../components/Templates/PageTemplate";
import Development from "./index";

const title = "Development";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <Development />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
