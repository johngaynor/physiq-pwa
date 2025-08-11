import React from "react";
import PageTemplate from "../../components/Templates/PageTemplate";
import CheckInFormWrapper from "./index";

const title = "New Check-In";

export default function Page() {
  return (
    <PageTemplate title={title} showTitleMobile>
      <CheckInFormWrapper />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
