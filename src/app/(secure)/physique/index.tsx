"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Card, CardContent } from "@/components/ui/card";
import { analyzePose } from "./state/actions";

function mapStateToProps(state: RootState) {
  return { user: state.app.user };
}

const connector = connect(mapStateToProps, { analyzePose });
type PropsFromRedux = ConnectedProps<typeof connector>;

const PhysiqueDashboard: React.FC<PropsFromRedux> = ({ user }) => {
  return (
    <div className="w-full">
      <Card className="w-full rounded-sm p-0">
        <CardContent className="p-8">
          placeholder physique dashboard for {user?.name || "user"}
        </CardContent>
      </Card>
    </div>
  );
};

export default connector(PhysiqueDashboard);
