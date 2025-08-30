import React from "react";
import PageTemplate from "../../../../components/Templates/PageTemplate";
import Exercise from "./index";

const title = "Exercise";

export default function Page() {
  return (
    <PageTemplate title={title} showTitleMobile>
      <Exercise />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
