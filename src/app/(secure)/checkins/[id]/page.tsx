import React from "react";
import PageTemplate from "../../components/Templates/PageTemplate";
import CheckIn from "./index";

const title = "Check-In";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <CheckIn />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
