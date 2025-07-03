"use client";
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui";
import { Download, Camera } from "lucide-react";
import { DietLog } from "@/app/(secure)/diet/state/types";
import { CheckIn } from "../../../state/types";

interface Html2CanvasModalProps {
  children: React.ReactNode;
  photos?: string[];
  healthStats?: Record<
    string,
    { day7Avg: number | null; day30Avg: number | null }
  >;
  dietLog?: DietLog | null;
  checkIn?: CheckIn;
}

const Html2CanvasModal: React.FC<Html2CanvasModalProps> = ({
  children,
  // photos,
  healthStats,
  dietLog,
  checkIn,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Helper function to format metric values
  const formatMetricValue = (metric: string, value: number | null): string => {
    if (value === null) return "No data";

    switch (metric) {
      case "calories":
        return `${Math.round(value).toLocaleString()}`;
      case "water":
        return `${value.toFixed(1)} oz`;
      case "steps":
        return `${Math.round(value).toLocaleString()}`;
      case "totalSleep":
        return `${(value / 60).toFixed(1)} hrs`; // Convert minutes to hours
      case "weight":
        return `${value.toFixed(1)} lbs`;
      default:
        return `${value.toFixed(1)}`;
    }
  };

  // Helper function to get metric display name
  const getMetricDisplayName = (metric: string): string => {
    switch (metric) {
      case "calories":
        return "Calories";
      case "water":
        return "Water";
      case "steps":
        return "Steps";
      case "totalSleep":
        return "Sleep";
      case "weight":
        return "Weight";
      default:
        return metric;
    }
  };

  // Helper function to get goal value from diet log
  const getGoalValue = (metric: string): string => {
    if (!dietLog) return "-";

    switch (metric) {
      case "calories":
        return dietLog.calories ? `${dietLog.calories.toLocaleString()}` : "-";
      case "water":
        return dietLog.water ? `${dietLog.water} oz` : "-";
      case "steps":
        return dietLog.steps ? `${dietLog.steps.toLocaleString()}` : "-";
      case "totalSleep":
        return "8 hrs"; // Default sleep goal
      case "weight":
        return "-"; // Weight doesn't have a specific goal
      default:
        return "-";
    }
  };

  const generateImage = async () => {
    if (!contentRef.current) return;

    setIsGenerating(true);
    try {
      // Import jsPDF dynamically to avoid SSR issues
      const { jsPDF } = await import("jspdf");

      // Create new PDF document (A4 size: 210 x 297 mm)
      const pdf = new jsPDF("portrait", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;

      // Find all page elements (direct children of contentRef)
      const pages = Array.from(contentRef.current.children) as HTMLElement[];
      console.log(`Found ${pages.length} pages to render`);

      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i];
        console.log(`Rendering page ${i + 1}/${pages.length}`);

        // Add new page for each page except the first
        if (i > 0) {
          pdf.addPage();
        }

        // Generate canvas for each individual page
        const canvas = await html2canvas(pageElement, {
          useCORS: true,
          allowTaint: true,
          logging: false,
          onclone: (clonedDoc: Document) => {
            // Add CSS to override problematic color functions
            const style = clonedDoc.createElement("style");
            style.textContent = `
              * {
                color: rgb(31, 41, 55) !important;
                background-color: rgb(255, 255, 255) !important;
                border-color: rgb(229, 231, 235) !important;
              }
              h1 {
                color: rgb(31, 41, 55) !important;
                background-color: transparent !important;
              }
              /* Override any oklch, hsl, or other unsupported color functions */
              [style*="oklch"], [class*="text-"], [class*="bg-"], [class*="border-"] {
                color: rgb(31, 41, 55) !important;
                background-color: rgb(255, 255, 255) !important;
                border-color: rgb(229, 231, 235) !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          },
        } as any);

        // Convert canvas to image data
        const imgData = canvas.toDataURL("image/png", 0.95); // Slightly compressed

        // Calculate dimensions to fit the page properly
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasRatio = canvasWidth / canvasHeight;

        // Add margins
        const margin = 10; // 10mm margins
        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;
        const maxRatio = maxWidth / maxHeight;

        let imgWidth, imgHeight;

        if (canvasRatio > maxRatio) {
          // Canvas is wider, fit to width
          imgWidth = maxWidth;
          imgHeight = maxWidth / canvasRatio;
        } else {
          // Canvas is taller, fit to height
          imgHeight = maxHeight;
          imgWidth = maxHeight * canvasRatio;
        }

        // Center the image on the page
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        console.log(
          `Adding page ${
            i + 1
          } to PDF: ${imgWidth}x${imgHeight}mm at (${x}, ${y})`
        );

        // Add image to PDF page
        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      }

      // Save the PDF
      const filename = `check-in-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      console.log(`Saving PDF as: ${filename}`);
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-6 w-[1000px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Generate Report PDF
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={generateImage}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Download PDF"}
            </Button>
          </div>

          {/* Content to be rendered - centered in modal */}
          <div className="flex justify-center">
            <div
              ref={contentRef}
              style={{
                backgroundColor: "#ffffff",
                fontFamily: "Arial, sans-serif",
                transform: "scale(0.85)", // Scale down slightly to fit better in modal
                transformOrigin: "top center",
              }}
            >
              {/* Health Metrics Report Page */}
              <div
                style={{
                  width: "816px", // 8.5 inches at 96 DPI
                  height: "1056px", // 11 inches at 96 DPI
                  padding: "48px", // ~0.5 inch margins
                  boxSizing: "border-box",
                  border: "1px solid #e5e7eb",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    textAlign: "center",
                    borderBottom: "2px solid #1f2937",
                    paddingBottom: "20px",
                    marginBottom: "30px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      marginBottom: "8px",
                      marginTop: "0",
                    }}
                  >
                    Health Metrics Report
                  </h1>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "16px",
                      margin: "0",
                    }}
                  >
                    Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>

                {/* Health Metrics Summary */}
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "2px solid #bbf7d0",
                    marginBottom: "16px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#166534",
                      marginTop: "0",
                      marginBottom: "12px",
                    }}
                  >
                    Health Metrics Overview
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "12px",
                      fontSize: "13px",
                    }}
                  >
                    <div>
                      <strong>Weight (7-day):</strong>{" "}
                      {healthStats?.weight?.day7Avg
                        ? formatMetricValue(
                            "weight",
                            healthStats.weight.day7Avg
                          )
                        : "No data"}
                    </div>
                    <div>
                      <strong>Steps (7-day):</strong>{" "}
                      {healthStats?.steps?.day7Avg
                        ? formatMetricValue("steps", healthStats.steps.day7Avg)
                        : "No data"}
                    </div>
                    <div>
                      <strong>Date:</strong>{" "}
                      {checkIn?.date
                        ? new Date(checkIn.date).toLocaleDateString()
                        : new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Statistics Table - More Compact */}
                <div
                  style={{
                    backgroundColor: "#faf5ff",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "2px solid #e9d5ff",
                    marginBottom: "16px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#6b21a8",
                      marginTop: "0",
                      marginBottom: "12px",
                    }}
                  >
                    Health Statistics Summary
                  </h2>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "11px",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#e9d5ff" }}>
                        <th
                          style={{
                            padding: "6px",
                            textAlign: "left",
                            color: "#6b21a8",
                            fontWeight: "600",
                            border: "1px solid #d8b4fe",
                          }}
                        >
                          Metric
                        </th>
                        <th
                          style={{
                            padding: "6px",
                            textAlign: "center",
                            color: "#6b21a8",
                            fontWeight: "600",
                            border: "1px solid #d8b4fe",
                          }}
                        >
                          Goal
                        </th>
                        <th
                          style={{
                            padding: "6px",
                            textAlign: "center",
                            color: "#6b21a8",
                            fontWeight: "600",
                            border: "1px solid #d8b4fe",
                          }}
                        >
                          7-Day Avg
                        </th>
                        <th
                          style={{
                            padding: "6px",
                            textAlign: "center",
                            color: "#6b21a8",
                            fontWeight: "600",
                            border: "1px solid #d8b4fe",
                          }}
                        >
                          30-Day Avg
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthStats &&
                        Object.entries(healthStats).map(
                          ([metric, stats], index) => (
                            <tr
                              key={metric}
                              style={{
                                backgroundColor:
                                  index % 2 === 0 ? "#ffffff" : "#f9fafb",
                              }}
                            >
                              <td
                                style={{
                                  padding: "5px 6px",
                                  color: "#374151",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                {getMetricDisplayName(metric)}
                              </td>
                              <td
                                style={{
                                  padding: "5px 6px",
                                  textAlign: "center",
                                  color: "#374151",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                {getGoalValue(metric)}
                              </td>
                              <td
                                style={{
                                  padding: "5px 6px",
                                  textAlign: "center",
                                  color: "#374151",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                {formatMetricValue(metric, stats.day7Avg)}
                              </td>
                              <td
                                style={{
                                  padding: "5px 6px",
                                  textAlign: "center",
                                  color: "#374151",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                {formatMetricValue(metric, stats.day30Avg)}
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>
                </div>

                {/* Check-In Comments Section */}
                {(checkIn?.comments ||
                  checkIn?.cheats ||
                  checkIn?.training) && (
                  <div
                    style={{
                      backgroundColor: "#eff6ff",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "2px solid #bfdbfe",
                      marginBottom: "16px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1e40af",
                        marginTop: "0",
                        marginBottom: "12px",
                      }}
                    >
                      Check-In Notes
                    </h2>
                    <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      {checkIn?.training && (
                        <div style={{ marginBottom: "8px" }}>
                          <strong style={{ color: "#1e40af" }}>
                            Training:
                          </strong>
                          <br />
                          <span style={{ color: "#374151" }}>
                            {checkIn.training}
                          </span>
                        </div>
                      )}
                      {checkIn?.cheats && (
                        <div style={{ marginBottom: "8px" }}>
                          <strong style={{ color: "#dc2626" }}>Cheats:</strong>
                          <br />
                          <span style={{ color: "#374151" }}>
                            {checkIn.cheats}
                          </span>
                        </div>
                      )}
                      {checkIn?.comments && (
                        <div style={{ marginBottom: "8px" }}>
                          <strong style={{ color: "#16a34a" }}>
                            Comments:
                          </strong>
                          <br />
                          <span style={{ color: "#374151" }}>
                            {checkIn.comments}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Weight Graph - Reduced Size */}
                <div
                  style={{
                    backgroundColor: "#fef3c7",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "2px solid #fbbf24",
                    flex: "1",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#d97706",
                      marginTop: "0",
                      marginBottom: "12px",
                    }}
                  >
                    Weight Progress (30 Days)
                  </h2>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      height: "120px",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      color: "#64748b",
                      position: "relative",
                    }}
                  >
                    {/* Simple ASCII-style graph placeholder */}
                    <div style={{ fontFamily: "monospace", lineHeight: "1.2" }}>
                      190 ├─●─────●───────●─────●─────●───
                      <br />
                      185 ├───●─────●─────●───●─────●─────
                      <br />
                      180 ├─────────────────────────────●─
                      <br />
                      175 └─────────────────────────────── <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;Week 1&nbsp;&nbsp;Week
                      2&nbsp;&nbsp;Week 3&nbsp;&nbsp;Week 4
                    </div>
                  </div>
                </div>
              </div>

              {/* Second page placeholder - can be removed or used for additional content */}
              <div
                style={{
                  width: "816px", // 8.5 inches at 96 DPI
                  height: "1056px", // 11 inches at 96 DPI
                  padding: "48px", // ~0.5 inch margins
                  boxSizing: "border-box",
                  border: "1px solid #e5e7eb",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center", color: "#9ca3af" }}>
                  <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
                    Additional Content
                  </h2>
                  <p style={{ fontSize: "16px" }}>
                    This page can be used for photos, graphs, or additional
                    notes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Html2CanvasModal;
