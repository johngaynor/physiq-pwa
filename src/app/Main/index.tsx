"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../store/reducer";
import { incrementCount, decrementCount } from "../Main/state/actions";
import { Button } from "@/components/ui";

function mapStateToProps(state: RootState) {
  return {
    count: state.app.count,
  };
}
const connector = connect(mapStateToProps, { incrementCount, decrementCount });
type PropsFromRedux = ConnectedProps<typeof connector>;

const Main: React.FC<PropsFromRedux> = ({
  count,
  incrementCount,
  decrementCount,
}) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="scroll-m-20 font-extrabold tracking-tight text-8xl text-center">
        Bodybuilding Redefined.
      </h1>
      <p className="text-lg">Count: {count}</p>
      <Button onClick={() => incrementCount()} className="mt-4">
        Increment
      </Button>
      <Button onClick={() => decrementCount()} className="mt-4">
        Decrement
      </Button>
    </div>
  );
};

export default connector(Main);
