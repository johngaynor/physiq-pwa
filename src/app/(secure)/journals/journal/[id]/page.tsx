import React from "react";
import PageTemplate from "../../../components/Templates/PageTemplate";
import JournalView from "./index";

const title = "Journal";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <JournalView />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
