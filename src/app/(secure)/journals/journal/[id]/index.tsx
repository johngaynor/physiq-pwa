"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Share } from "lucide-react";
import EditorJS from "@editorjs/editorjs";

function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
    journals: state.journals.journals,
    journalsLoading: state.journals.journalsLoading,
  };
}

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const JournalView: React.FC<PropsFromRedux> = ({
  journals,
  journalsLoading,
}) => {
  const params = useParams();
  const router = useRouter();
  const editorRef = useRef<EditorJS | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const journalId = params.id as string;

  // Find the journal from the existing journals array
  const journal = journals?.find((j) => j.id === journalId) || null;

  // Initialize Editor.js in read-only mode
  useEffect(() => {
    if (journal && journal.content && !editorRef.current) {
      try {
        let editorData;

        // Parse content if it's a string
        if (typeof journal.content === "string") {
          editorData = JSON.parse(journal.content);
        } else {
          editorData = journal.content;
        }

        editorRef.current = new EditorJS({
          holder: "journal-editor",
          data: editorData,
          readOnly: true,
          minHeight: 50,
          onReady: () => {
            setIsEditorReady(true);
          },
        });
      } catch (error) {
        console.error("Error initializing editor:", error);
        setIsEditorReady(true); // Still show the component even if editor fails
      }
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [journal]);

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (journalsLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-16" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (!journal && !journalsLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">Journal not found</h3>
            <p className="text-muted-foreground mb-4">
              The journal you&apos;re looking for doesn&apos;t exist or has been
              deleted.
            </p>
            <Button onClick={() => router.push("/journals")}>
              Back to Journals
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Journal content */}
      {journal && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">
                    {journal.title || "Untitled Journal"}
                  </h1>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Created: {formatDate(journal.createdAt)}</p>
                  {journal.lastUpdated !== journal.createdAt && (
                    <p>Last updated: {formatDate(journal.lastUpdated)}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/journals/journal/${journal.id}/edit`)
                  }
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Editor.js container */}
            <div className="prose prose-lg max-w-none">
              <div id="journal-editor" className="min-h-[200px]">
                {!isEditorReady && (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default connector(JournalView);
