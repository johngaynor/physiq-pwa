"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { getCompleteSessionData } from "./localDB_old";
import DataView from "./components/DataView";
import TrainingManagement from "./components/TrainingManagement";
import { Checkbox } from "@/components/ui";

function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
  };
}

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Training: React.FC<PropsFromRedux> = ({ user }) => {
  const [completeData, setCompleteData] = React.useState<any[]>([]);
  const [selectedSession, setSelectedSession] = React.useState<string | null>(
    null
  );
  const [selectedExercise, setSelectedExercise] = React.useState<string | null>(
    null
  );
  const [showAdmin, setShowAdmin] = React.useState<boolean>(false);

  const refreshData = async () => {
    const data = await getCompleteSessionData();
    setCompleteData(data);
  };

  const isAdmin = user?.apps.some((app) => app.id === 1);

  React.useEffect(() => {
    refreshData();
  }, []);

  return (
    <>
      {isAdmin && (
        <Checkbox
          checked={showAdmin}
          onCheckedChange={() => setShowAdmin(!showAdmin)}
        />
      )}
      <div className="flex w-full md:flex-row flex-col">
        <TrainingManagement
          completeData={completeData}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          selectedExercise={selectedExercise}
          setSelectedExercise={setSelectedExercise}
          onRefreshData={refreshData}
        />
        {showAdmin && <DataView onDataChange={refreshData} />}
      </div>
    </>
  );
};

export default connector(Training);
