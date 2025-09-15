"use client";
import React from "react";
import { useParams } from "next/navigation";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { getJournals } from "../../state/actions";
import ViewJournal from "./components/ViewJournal";
import JournalEditor from "../../new/components/EditJournal";

function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
    journals: state.journals.journals,
    journalsLoading: state.journals.journalsLoading,
  };
}

const connector = connect(mapStateToProps, {
  getJournals,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const JournalView: React.FC<PropsFromRedux> = ({
  journals,
  journalsLoading,
  getJournals,
}) => {
  const [editJournal, setEditJournal] = React.useState<boolean>(false);
  const params = useParams();
  const journalId = params.id as string;

  React.useEffect(() => {
    if (!journals && !journalsLoading) getJournals();
  }, [journals, journalsLoading, getJournals]);

  // Find the journal from the existing journals array
  const journal = React.useMemo(() => {
    return journals?.find((j) => j.id === journalId) || null;
  }, [journals, journalId]);

  // Loading state
  if (journalsLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="border rounded-lg">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit mode
  if (editJournal && journal) {
    return (
      <JournalEditor
        entry={{
          id: journal.id,
          title: journal.title || "",
          content: journal.content,
        }}
        onCancel={() => setEditJournal(false)}
      />
    );
  }

  // View mode
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <ViewJournal journal={journal} setEditJournal={setEditJournal} />
    </div>
  );
};

export default connector(JournalView);
