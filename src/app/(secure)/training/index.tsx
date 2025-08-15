"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { getCompleteSessionData } from "./localDB";
import DataView from "./components/DataView";
import TrainingManagement from "./components/TrainingManagement";

function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
  };
}

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Training: React.FC<PropsFromRedux> = ({}) => {
  const [completeData, setCompleteData] = React.useState<any[]>([]);
  const [selectedSession, setSelectedSession] = React.useState<string | null>(
    null
  );
  const [selectedExercise, setSelectedExercise] = React.useState<string | null>(
    null
  );

  const refreshData = async () => {
    const data = await getCompleteSessionData();
    setCompleteData(data);
  };

  React.useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="flex w-full">
      <DataView onDataChange={refreshData} />
      <TrainingManagement
        completeData={completeData}
        selectedSession={selectedSession}
        setSelectedSession={setSelectedSession}
        selectedExercise={selectedExercise}
        setSelectedExercise={setSelectedExercise}
        onRefreshData={refreshData}
      />
    </div>
  );
};

export default connector(Training);
