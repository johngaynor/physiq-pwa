"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Card, CardContent } from "@/components/ui/card";
import { getJournals } from "./state/actions";

function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
    journals: state.journals.journals,
    journalsLoading: state.journals.journalsLoading,
  };
}

const connector = connect(mapStateToProps, { getJournals });
type PropsFromRedux = ConnectedProps<typeof connector>;

const Journals: React.FC<PropsFromRedux> = ({
  user,
  journals,
  journalsLoading,
  getJournals,
}) => {
  React.useEffect(() => {
    if (!journals && !journalsLoading) getJournals();
  }, [journals, journalsLoading, getJournals]);

  console.log({ journals });

  return (
    <div className="w-full">
      <Card className="w-full rounded-sm p-0">
        <CardContent className="p-8">
          placeholder journals for {user?.name || "user"}
        </CardContent>
      </Card>
    </div>
  );
};

export default connector(Journals);
