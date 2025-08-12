import React from "react";
import PageTemplate from "../../components/Templates/PageTemplate";
import Exercises from "./index";

const title = "Exercises";

export default function Page() {
  return (
    <PageTemplate title={title} showTitleMobile>
      <Exercises />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
