"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../../store/reducer";

function mapStateToProps(state: RootState) {
  return {
    // Add any state you need here
    supplements: state.health.supplements,
  };
}

const connector = connect(mapStateToProps, {
  // Add any actions you need here
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const NewSupplement: React.FC<PropsFromRedux> = ({}) => {
  const handleSubmit = (data: any) => {
    console.log("New supplement submission:", data);
    // TODO: Implement supplement creation logic
  };

  return (
    <div className="w-full flex flex-col gap-4 mb-20">
      <div className="border-2 p-4 rounded-md w-full">
        <h2 className="text-xl font-semibold mb-4">Create New Supplement</h2>
        <p className="text-muted-foreground">
          Supplement form will be implemented here similar to the diet log form
          structure.
        </p>
        <button
          onClick={() => handleSubmit({ test: "data" })}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Submit (Console Log)
        </button>
      </div>
    </div>
  );
};

export default connector(NewSupplement);
