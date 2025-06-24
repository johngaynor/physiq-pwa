import React from "react";
import PageTemplate from "../components/Templates/PageTemplate";
// import DietDashboard from "./index";

const title = "Reports";

export default function Page() {
  return (
    <PageTemplate title={title}>{/* <DietDashboard /> */}reports</PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
