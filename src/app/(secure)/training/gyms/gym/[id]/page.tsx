import React from "react";
import PageTemplate from "../../../../components/Templates/PageTemplate";
import Gym from "./index";

const title = "Gym";

export default function Page() {
  return (
    <PageTemplate title={title} showTitleMobile>
      <Gym />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
