"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { getApps } from "../state/actions";

function mapStateToProps(state: RootState) {
  return {
    apps: state.app.apps,
    appsLoading: state.app.appsLoading,
  };
}

const connector = connect(mapStateToProps, { getApps });
type PropsFromRedux = ConnectedProps<typeof connector>;

const HealthPage: React.FC<PropsFromRedux> = ({
  apps,
  appsLoading,
  getApps,
}) => {
  React.useEffect(() => {
    if (!apps && !appsLoading) getApps();
  });
  console.log(apps);
  // const healthApps = apps?.filter((app) => app.link.includes("/health"));
  // console.log({ healthApps });
  return <div className="w-full">HEALTH APPS</div>;
};

export default connector(HealthPage);
