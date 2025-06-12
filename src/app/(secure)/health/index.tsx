"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";

function mapStateToProps(state: RootState) {
  return {
    apps: state.app.apps,
  };
}

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const HealthPage: React.FC<PropsFromRedux> = ({ apps }) => {
  const healthApps = apps?.filter((app) => app.route.includes("/health"));
  console.log({ healthApps });
  return <div className="w-full">HEALTH APPS</div>;
};

export default connector(HealthPage);
