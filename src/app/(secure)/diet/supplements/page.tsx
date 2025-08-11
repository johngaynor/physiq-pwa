import React from "react";
import PageTemplate from "../../components/Templates/PageTemplate";
import Supplements from "./index";

const title = "Supplements";

export default function Page() {
  return (
    <PageTemplate title={title} showTitleMobile>
      <Supplements />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
