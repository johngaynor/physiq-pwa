"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Share } from "lucide-react";
import { Journal } from "../../../state/types";

interface ViewJournalProps {
  journal: Journal | null;
  setEditJournal: (editing: boolean) => void;
}

const ViewJournal: React.FC<ViewJournalProps> = ({
  journal,
  setEditJournal,
}) => {
  const router = useRouter();
  const editorRef = useRef<any>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorId] = useState(() => `journal-editor-view-${Math.random().toString(36).substr(2, 9)}`);

  // Initialize Editor.js in read-only mode
  useEffect(() => {
    let mounted = true;

    if (journal && journal.content && !editorRef.current) {
      const initEditor = async () => {
        try {
          // Clean up any existing editor first
          if (editorRef.current) {
            try {
              // Check if editor is ready before destroying
              if (editorRef.current.readOnly !== undefined) {
                await editorRef.current.destroy();
              }
            } catch (error: any) {
              // Suppress the mobile layout toggled warning as it's harmless
              if (!error.message?.includes("editor mobile layout toggled")) {
                console.error("Error destroying existing editor:", error);
              }
            }
            editorRef.current = null;
          }

          if (!mounted) return;

          // Import all the Editor.js tools
          const EditorJS = (await import("@editorjs/editorjs")).default;
          const Header = (await import("@editorjs/header")).default;
          const List = (await import("@editorjs/list")).default;
          // @ts-expect-error - @editorjs/embed lacks proper TypeScript definitions
          const Embed = (await import("@editorjs/embed")).default;
          const Table = (await import("@editorjs/table")).default;
          const Paragraph = (await import("@editorjs/paragraph")).default;
          const Warning = (await import("@editorjs/warning")).default;
          const Code = (await import("@editorjs/code")).default;
          // @ts-expect-error - @editorjs/link lacks proper TypeScript definitions
          const LinkTool = (await import("@editorjs/link")).default;
          const Image = (await import("@editorjs/image")).default;
          // @ts-expect-error - @editorjs/raw lacks proper TypeScript definitions
          const Raw = (await import("@editorjs/raw")).default;
          const Quote = (await import("@editorjs/quote")).default;
          // @ts-expect-error - @editorjs/marker lacks proper TypeScript definitions
          const Marker = (await import("@editorjs/marker")).default;
          // @ts-expect-error - @editorjs/checklist lacks proper TypeScript definitions
          const CheckList = (await import("@editorjs/checklist")).default;
          const Delimiter = (await import("@editorjs/delimiter")).default;
          const InlineCode = (await import("@editorjs/inline-code")).default;
          // @ts-expect-error - @editorjs/simple-image lacks proper TypeScript definitions
          const SimpleImage = (await import("@editorjs/simple-image")).default;

          if (!mounted) return;

          let editorData;

          // Parse content if it's a string
          if (typeof journal.content === "string") {
            editorData = JSON.parse(journal.content);
          } else {
            editorData = journal.content;
          }

          editorRef.current = new EditorJS({
            holder: editorId,
            data: editorData,
            readOnly: true,
            minHeight: 50,
            // Add a small delay to prevent race conditions
            onReady: () => {
              setTimeout(() => {
                if (mounted) {
                  setIsEditorReady(true);
                }
              }, 100);
            },
            tools: {
              // Text tools
              header: Header as any,
              paragraph: {
                class: Paragraph as any,
                inlineToolbar: ["marker", "link"],
              },

              // List tools
              list: List as any,
              checklist: CheckList as any,

              // Media tools
              image: Image as any,
              simpleImage: SimpleImage as any,
              embed: Embed as any,

              // Content tools
              quote: Quote as any,
              warning: Warning as any,
              code: Code as any,
              raw: Raw as any,
              delimiter: Delimiter as any,
              table: Table as any,

              // Link tool
              linkTool: LinkTool as any,

              // Inline tools
              marker: Marker as any,
              inlineCode: InlineCode as any,
            },
          });
        } catch (error) {
          console.error("Error initializing editor:", error);
          if (mounted) {
            setIsEditorReady(true); // Still show the component even if editor fails
          }
        }
      };

      initEditor();
    }

    return () => {
      mounted = false;
      if (editorRef.current) {
        try {
          // Check if editor is ready before destroying
          if (editorRef.current.readOnly !== undefined) {
            // Editor is fully initialized, safe to destroy
            const destroyResult = editorRef.current.destroy();
            if (destroyResult && typeof destroyResult.then === "function") {
              destroyResult.catch((error: any) => {
                // Suppress the mobile layout toggled warning as it's harmless
                if (!error.message?.includes("editor mobile layout toggled")) {
                  console.error("Error during editor cleanup:", error);
                }
              });
            }
          }
        } catch (error: any) {
          // Suppress the mobile layout toggled warning as it's harmless
          if (!error.message?.includes("editor mobile layout toggled")) {
            console.error("Error during cleanup:", error);
          }
        } finally {
          editorRef.current = null;
        }
      }
      setIsEditorReady(false);
    };
  }, [journal, editorId]);

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

  if (!journal) {
    return (
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
    );
  }

  return (
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
              variant="outline"
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
              onClick={() => setEditJournal(true)}
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
          <div
            id={editorId}
            className="min-h-[200px] max-w-none [&_.ce-block]:my-2 [&_.ce-header]:font-bold [&_.ce-header[data-level='1']]:text-3xl [&_.ce-header[data-level='2']]:text-2xl [&_.ce-header[data-level='3']]:text-xl [&_.ce-header[data-level='4']]:text-lg [&_.ce-header[data-level='5']]:text-base [&_.ce-header[data-level='6']]:text-sm [&_.ce-list]:list-disc [&_.ce-list]:ml-4 [&_.ce-quote]:border-l-4 [&_.ce-quote]:border-gray-300 [&_.ce-quote]:pl-4 [&_.ce-quote]:italic [&_.ce-warning]:bg-yellow-50 [&_.ce-warning]:border-yellow-200 [&_.ce-warning]:border [&_.ce-warning]:rounded [&_.ce-warning]:p-4 [&_.ce-code]:bg-gray-100 [&_.ce-code]:rounded [&_.ce-code]:p-2 [&_.ce-delimiter]:text-center [&_.ce-delimiter]:my-6"
          >
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
  );
};

export default ViewJournal;
