"use client";

import React, { useState, useRef, useEffect } from "react";
import { OutputData } from "@editorjs/editorjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { H3 } from "@/components/ui/typography";

interface JournalEntry {
  id: string;
  title: string;
  content: OutputData;
}

interface JournalEditorProps {
  entry?: JournalEntry;
  onSubmit: (data: JournalEntry) => void;
  onCancel?: () => void;
}

const JournalEditor: React.FC<JournalEditorProps> = ({
  entry,
  onSubmit,
  onCancel,
}) => {
  const editorRef = useRef<any>(null);
  const [title, setTitle] = useState(entry?.title || "");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorData, setEditorData] = useState<OutputData | null>(null);
  const [showDevTools, setShowDevTools] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initEditor = async () => {
      // Cleanup any existing editor first
      if (editorRef.current) {
        try {
          await editorRef.current.destroy();
          editorRef.current = null;
        } catch (error) {
          console.error("Error destroying existing editor:", error);
        }
      }

      if (!mounted) return;

      try {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        // @ts-ignore
        const Embed = (await import("@editorjs/embed")).default;
        const Table = (await import("@editorjs/table")).default;
        const Paragraph = (await import("@editorjs/paragraph")).default;
        const Warning = (await import("@editorjs/warning")).default;
        const Code = (await import("@editorjs/code")).default;
        // @ts-ignore
        const LinkTool = (await import("@editorjs/link")).default;
        const Image = (await import("@editorjs/image")).default;
        // @ts-ignore
        const Raw = (await import("@editorjs/raw")).default;
        const Quote = (await import("@editorjs/quote")).default;
        // @ts-ignore
        const Marker = (await import("@editorjs/marker")).default;
        // @ts-ignore
        const CheckList = (await import("@editorjs/checklist")).default;
        const Delimiter = (await import("@editorjs/delimiter")).default;
        const InlineCode = (await import("@editorjs/inline-code")).default;
        // @ts-ignore
        const SimpleImage = (await import("@editorjs/simple-image")).default;

        if (!mounted) return;

        editorRef.current = new EditorJS({
          holder: "journal-editor",
          placeholder: "Start writing your journal entry...",
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
          data: entry?.content || undefined,
          onChange: async () => {
            console.log("Editor content changed");
            try {
              if (editorRef.current && mounted) {
                const currentData = await editorRef.current.save();
                setEditorData(currentData);
              }
            } catch (error) {
              console.error("Error getting editor data:", error);
            }
          },
          onReady: () => {
            if (mounted) {
              setIsEditorReady(true);
              console.log("Editor.js is ready");
            }
          },
        });
      } catch (error) {
        console.error("Failed to initialize editor:", error);
      }
    };

    initEditor();

    return () => {
      mounted = false;
      if (editorRef.current) {
        try {
          const destroyResult = editorRef.current.destroy();
          if (destroyResult && typeof destroyResult.catch === "function") {
            destroyResult.catch(console.error);
          }
        } catch (error) {
          console.error("Error during cleanup:", error);
        } finally {
          editorRef.current = null;
        }
      }
      setIsEditorReady(false);
    };
  }, []);

  const handleSubmit = async () => {
    if (!editorRef.current || !isEditorReady) return;

    try {
      const outputData = await editorRef.current.save();

      const journalEntry: JournalEntry = {
        id: entry ? entry.id : crypto.randomUUID(),
        title:
          title.trim() || `Journal Entry - ${new Date().toLocaleDateString()}`,
        content: outputData,
      };

      onSubmit(journalEntry);
    } catch (error) {
      console.error("Saving failed:", error);
    }
  };

  const handleReset = async () => {
    setTitle("");
    setEditorData(null);

    if (editorRef.current && isEditorReady) {
      try {
        await editorRef.current.clear();
      } catch (error) {
        console.error("Error clearing editor:", error);
      }
    }
  };

  return (
    <>
      <style jsx global>{`
        /* Hide Editor.js toolbar by default, show on hover/focus */
        .ce-toolbar {
          opacity: 0 !important;
          transition: opacity 0.2s ease-in-out !important;
        }

        #journal-editor:hover .ce-toolbar,
        #journal-editor:focus-within .ce-toolbar,
        .ce-toolbar:hover,
        .ce-toolbar:focus-within {
          opacity: 1 !important;
        }

        /* Also hide the settings button when not hovering */
        .ce-toolbar__settings-btn {
          opacity: 0 !important;
          transition: opacity 0.2s ease-in-out !important;
        }

        #journal-editor:hover .ce-toolbar__settings-btn,
        #journal-editor:focus-within .ce-toolbar__settings-btn,
        .ce-toolbar:hover .ce-toolbar__settings-btn,
        .ce-block:hover .ce-toolbar__settings-btn {
          opacity: 1 !important;
        }

        /* Editor.js Toolbar Dark Mode Styles */
        .dark .ce-toolbar__plus,
        .dark .ce-toolbar__settings-btn {
          background: #374151 !important;
          color: #f9fafb !important;
          border: 1px solid #4b5563 !important;
        }

        .dark .ce-toolbar__plus:hover,
        .dark .ce-toolbar__settings-btn:hover {
          background: #4b5563 !important;
          color: #ffffff !important;
        }

        .dark .ce-popover {
          background: #1f2937 !important;
          border: 1px solid #4b5563 !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
        }

        .dark .ce-popover__item {
          color: #f9fafb !important;
        }

        .dark .ce-popover__item:hover {
          background: #374151 !important;
          color: #ffffff !important;
        }

        .dark .ce-popover__item-icon {
          background: #4b5563 !important;
          color: #f9fafb !important;
        }

        .dark .ce-tooltip {
          background: #1f2937 !important;
          color: #f9fafb !important;
          border: 1px solid #4b5563 !important;
        }

        .dark .ce-tooltip:before {
          border-top-color: #1f2937 !important;
        }

        .dark .ce-inline-toolbar {
          background: #1f2937 !important;
          border: 1px solid #4b5563 !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
        }

        .dark .ce-inline-tool {
          color: #f9fafb !important;
        }

        .dark .ce-inline-tool:hover {
          background: #374151 !important;
          color: #ffffff !important;
        }

        .dark .ce-conversion-toolbar {
          background: #1f2937 !important;
          border: 1px solid #4b5563 !important;
        }

        .dark .ce-conversion-tool {
          color: #f9fafb !important;
        }

        .dark .ce-conversion-tool:hover {
          background: #374151 !important;
          color: #ffffff !important;
        }
      `}</style>
      <div className="w-full mb-20">
        <Card className="w-full mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                <H3>Journal Entry</H3>
              </CardTitle>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dev-tools"
                    checked={showDevTools}
                    onCheckedChange={(checked) =>
                      setShowDevTools(checked === true)
                    }
                  />
                  <Label htmlFor="dev-tools" className="text-sm font-normal">
                    Dev Tools
                  </Label>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  type="button"
                >
                  Reset Form
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter journal title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div
              className={showDevTools ? "grid grid-cols-2 gap-6" : "space-y-2"}
            >
              <div className="space-y-2">
                <Label>Content</Label>
                <div
                  id="journal-editor"
                  className="min-h-[400px] border rounded-md p-4 max-w-none [&_.ce-block]:my-2 [&_.ce-toolbar]:z-10 [&_.ce-header]:font-bold [&_.ce-header[data-level='1']]:text-3xl [&_.ce-header[data-level='2']]:text-2xl [&_.ce-header[data-level='3']]:text-xl [&_.ce-header[data-level='4']]:text-lg [&_.ce-header[data-level='5']]:text-base [&_.ce-header[data-level='6']]:text-sm"
                  style={{
                    outline: "none",
                  }}
                />
                {!isEditorReady && (
                  <div className="text-sm text-gray-500 mt-2">
                    Loading editor...
                  </div>
                )}
              </div>

              {showDevTools && (
                <div className="space-y-2">
                  <Label>Live JSON Output</Label>
                  <div className="min-h-[400px] border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                    <pre className="text-xs overflow-auto whitespace-pre-wrap break-words">
                      {editorData
                        ? JSON.stringify(editorData, null, 2)
                        : "No data yet..."}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              {onCancel && (
                <Button variant="outline" onClick={onCancel} type="button">
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={!isEditorReady}
                variant="default"
              >
                Save Journal Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default JournalEditor;
