import React from "react";
import PageTemplate from "../../../components/Templates/PageTemplate";
import ExerciseFormWrapper from "./index";

const title = "New Exercise";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <ExerciseFormWrapper />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
