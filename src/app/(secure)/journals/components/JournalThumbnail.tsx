import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Journal } from "../state/types";
import MiniDocumentPreview from "./MiniDocumentPreview";

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface JournalThumbnailProps {
  journal: Journal;
}

const JournalThumbnail: React.FC<JournalThumbnailProps> = ({ journal }) => {
  const router = useRouter();

  return (
    <Card
      className="w-full hover:shadow-md transition-shadow cursor-pointer flex flex-col"
      style={{ aspectRatio: "8.5/11" }} // Standard paper aspect ratio
      onClick={() => router.push(`/journals/journal/${journal.id}`)}
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {journal.title || "Untitled Journal"}
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/journals/journal/${journal.id}`);
            }}
            className="ml-2 shrink-0"
          >
            View
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatDate(journal.createdAt)}
        </p>
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
        {/* Mini document preview */}
        <div className="flex-1 mb-3">
          <MiniDocumentPreview
            content={journal.content}
            className="w-full h-full"
          />
        </div>

        <div className="mt-4 flex justify-between items-center pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Last updated: {formatDate(journal.lastUpdated)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Add delete functionality
              console.log("Delete journal:", journal.id);
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalThumbnail;
