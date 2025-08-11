import React from "react";
import PageTemplate from "../../../components/Templates/PageTemplate";
import SupplementsManager from "./index";

const title = "Supplements Manager";

export default function Page() {
  return (
    <PageTemplate title={title} showTitleMobile>
      <SupplementsManager />
    </PageTemplate>
  );
}

export const metadata = {
  title: "Supplements Manager",
  description: "Manage and edit supplements in the database",
};
