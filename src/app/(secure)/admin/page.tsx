import React from "react";
import PageTemplate from "../components/Templates/PageTemplate";
import AdminConsole from "./index";

const title = "Admin Console";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <AdminConsole />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
