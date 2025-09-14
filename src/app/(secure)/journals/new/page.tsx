import React from "react";
import PageTemplate from "../../components/Templates/PageTemplate";
import EditJournalWrapper from "./index";

const title = "New Journal";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <EditJournalWrapper />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
