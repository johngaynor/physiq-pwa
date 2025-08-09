import React from "react";
import PageTemplate from "../components/Templates/PageTemplate";
// import SleepDashboard from "./index";

const title = "Sleep";

export default function Page() {
  return (
    <PageTemplate title={title}>{/* <SleepDashboard /> */}sleep</PageTemplate>
  );
}

export const metadata = {
  title: `${title} | Physiq`,
};
