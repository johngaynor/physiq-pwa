"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getJournals } from "../state/actions";
import EditJournalLoading from "./components/EditJournalLoading";
import JournalEditor from "./components/EditJournal";
import { useRouter } from "next/navigation";

function mapStateToProps(state: RootState) {
  return {
    journals: state.journals.journals,
    journalsLoading: state.journals.journalsLoading,
  };
}

const connector = connect(mapStateToProps, {
  getJournals,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const EditJournalWrapper: React.FC<PropsFromRedux> = ({
  journals,
  journalsLoading,
  getJournals,
}) => {
  const router = useRouter();

  React.useEffect(() => {
    if (!journals && !journalsLoading) getJournals();
  }, [journals, journalsLoading, getJournals]);

  if (journalsLoading) {
    return <EditJournalLoading />;
  } else {
    return <JournalEditor handleCancel={() => router.push("/journals")} />;
  }
};

export default connector(EditJournalWrapper);
