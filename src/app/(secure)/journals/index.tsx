"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../../store/reducer";
import { Input, Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { getJournals } from "./state/actions";
import JournalsLoading from "./components/JournalsLoading";
import JournalThumbnail from "./components/JournalThumbnail";

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
  journals,
  journalsLoading,
  getJournals,
}) => {
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    if (!journals && !journalsLoading) getJournals();
  }, [journals, journalsLoading, getJournals]);

  return (
    <div className="w-full space-y-6">
      <div className="mb-2 flex flex-row">
        <Input
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search diet logs..."
          className="col-span-3"
          type="text"
        />
        <Button
          className="ml-2"
          variant="outline"
          onClick={() => router.push("/diet/new")}
        >
          <div className="flex">
            <Plus className=" font-extrabold" />
          </div>
        </Button>
      </div>

      {/* Journals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {journalsLoading ? (
          <JournalsLoading />
        ) : journals && journals.length > 0 ? (
          // Journal thumbnails
          journals.map((journal) => (
            <JournalThumbnail key={journal.id} journal={journal} />
          ))
        ) : (
          // Empty state
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No journals yet</h3>
              <p className="text-muted-foreground mb-4">
                Start writing your first journal entry
              </p>
              <Button>Create Your First Journal</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default connector(Journals);
