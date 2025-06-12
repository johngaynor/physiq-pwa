"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";

function mapStateToProps(state: RootState) {
  return {
    apps: state.app.apps,
  };
}

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const LogPage: React.FC<PropsFromRedux> = ({ apps }) => {
  // const logApps = apps?.filter((app) => app.route.includes("/health/logs"));
  // console.log({ logApps });
  return <div className="w-full">TEST CONTENT</div>;
};

const index = connector(LogPage);
export default index;
