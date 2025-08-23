import React from "react";
import PageTemplate from "../../../components/Templates/PageTemplate";
import GymFormWrapper from "./index";

const title = "New Gym";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <GymFormWrapper />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
