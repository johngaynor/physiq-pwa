"use client";
import React from "react";

interface MiniDocumentPreviewProps {
  content: any;
  className?: string;
}

const MiniDocumentPreview: React.FC<MiniDocumentPreviewProps> = ({
  content,
  className = "",
}) => {
  const renderBlock = (block: any, index: number) => {
    const baseStyle = "mb-1";

    switch (block.type) {
      case "paragraph":
        const paragraphText =
          block.data?.text && typeof block.data.text === "string"
            ? block.data.text.replace(/<[^>]*>/g, "")
            : "";
        return (
          <div
            key={index}
            className={`${baseStyle} text-foreground/80 break-words`}
            style={{
              fontSize: "10px",
              lineHeight: "14px",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {paragraphText}
          </div>
        );

      case "header":
        const headerSizes = {
          1: "14px",
          2: "12px",
          3: "11px",
          4: "10px",
          5: "9px",
          6: "8px",
        };
        return (
          <div
            key={index}
            className={`${baseStyle} font-semibold text-foreground mb-1 break-words`}
            style={{
              fontSize:
                headerSizes[block.data?.level as keyof typeof headerSizes] ||
                "10px",
              lineHeight: "16px",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {block.data?.text && typeof block.data.text === "string"
              ? block.data.text.replace(/<[^>]*>/g, "")
              : ""}
          </div>
        );

      case "list":
        return (
          <div key={index} className="mb-1">
            {block.data?.items?.slice(0, 3).map((item: any, i: number) => {
              // Handle different item formats from Editor.js
              let itemText = "";
              if (typeof item === "string") {
                itemText = item;
              } else if (item && typeof item === "object") {
                // Handle object-based list items (e.g., { content: "text" })
                itemText = item.content || item.text || JSON.stringify(item);
              } else {
                itemText = String(item || "");
              }

              return (
                <div
                  key={i}
                  className="flex items-start"
                  style={{ fontSize: "9px", lineHeight: "12px" }}
                >
                  <span className="text-muted-foreground mr-1 flex-shrink-0">
                    •
                  </span>
                  <span
                    className="text-foreground/80 break-words"
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {itemText.replace(/<[^>]*>/g, "")}
                  </span>
                </div>
              );
            })}
          </div>
        );

      case "checklist":
        return (
          <div key={index} className="mb-1">
            {block.data?.items?.slice(0, 3).map((item: any, i: number) => {
              // Handle different checklist item formats from Editor.js
              let itemText = "";
              let isChecked = false;

              if (typeof item === "string") {
                itemText = item;
              } else if (item && typeof item === "object") {
                // Handle object-based checklist items (e.g., { text: "text", checked: false })
                itemText = item.text || item.content || JSON.stringify(item);
                isChecked = Boolean(item.checked);
              } else {
                itemText = String(item || "");
              }

              return (
                <div
                  key={i}
                  className="flex items-start"
                  style={{ fontSize: "9px", lineHeight: "12px" }}
                >
                  <span className="text-muted-foreground mr-1 flex-shrink-0">
                    {isChecked ? "☑" : "☐"}
                  </span>
                  <span
                    className={`text-foreground/80 break-words ${
                      isChecked ? "line-through" : ""
                    }`}
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {itemText.replace(/<[^>]*>/g, "")}
                  </span>
                </div>
              );
            })}
          </div>
        );

      case "quote":
        return (
          <div
            key={index}
            className="border-l border-border pl-1 mb-1 italic text-muted-foreground break-words"
            style={{
              fontSize: "9px",
              lineHeight: "12px",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {block.data?.text && typeof block.data.text === "string"
              ? block.data.text.replace(/<[^>]*>/g, "")
              : ""}
          </div>
        );

      case "code":
        return (
          <div
            key={index}
            className="bg-muted p-1 rounded mb-1 font-mono text-foreground/90 overflow-hidden"
            style={{
              fontSize: "8px",
              lineHeight: "11px",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {block.data?.code || ""}
          </div>
        );

      case "delimiter":
        return (
          <div key={index} className="text-center text-muted-foreground my-1">
            <span style={{ fontSize: "10px" }}>* * *</span>
          </div>
        );

      default:
        return null;
    }
  };

  const getBlocks = () => {
    try {
      let parsedContent;

      if (typeof content === "string") {
        parsedContent = JSON.parse(content);
      } else {
        parsedContent = content;
      }

      return parsedContent?.blocks || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const blocks = getBlocks();

  if (!blocks.length) {
    return (
      <div
        className={`${className} flex items-center justify-center text-muted-foreground bg-background h-full`}
      >
        <span style={{ fontSize: "10px" }}>Empty document</span>
      </div>
    );
  }

  return (
    <div
      className={`${className} bg-background p-3 border border-border rounded-sm h-full overflow-hidden`}
    >
      <div className="space-y-1 h-full overflow-hidden">
        {blocks
          .slice(0, 20) // Show more blocks to fill the taller space
          .map((block: any, index: number) => renderBlock(block, index))}
      </div>
    </div>
  );
};

export default MiniDocumentPreview;
