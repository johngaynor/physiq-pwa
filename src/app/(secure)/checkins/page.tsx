import React from "react";
import PageTemplate from "../components/Templates/PageTemplate";

const title = "Check Ins";

export default function Page() {
  return <PageTemplate title={title}>Check Ins</PageTemplate>;
}

export const metadata = {
  title: `${title} | Physiq`,
};
