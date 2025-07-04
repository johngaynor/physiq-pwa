"use client";
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
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
import { DailyLog } from "@/app/(secure)/health/state/types";
import { CheckIn } from "../../../state/types";
import WeightChart from "./WeightChart";

interface Html2CanvasModalProps {
  children: React.ReactNode;
  photos?: string[];
  healthStats?: Record<
    string,
    { day7Avg: number | null; day30Avg: number | null }
  >;
  dietLog?: DietLog | null;
  checkIn?: CheckIn;
  dailyLogs?: DailyLog[] | null;
}

const Html2CanvasModal: React.FC<Html2CanvasModalProps> = ({
  children,
  photos,
  healthStats,
  dietLog,
  checkIn,
  dailyLogs,
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

  // Helper function to get numeric goal value
  const getNumericGoalValue = (metric: string): number | null => {
    if (!dietLog) return null;

    switch (metric) {
      case "calories":
        return dietLog.calories || null;
      case "water":
        return dietLog.water || null;
      case "steps":
        return dietLog.steps || null;
      case "totalSleep":
        return 8 * 60; // 8 hours in minutes
      case "weight":
        return null; // Weight doesn't have a specific goal
      default:
        return null;
    }
  };

  // Helper function to calculate trends
  const getTrends = (
    metric: string,
    stats: { day7Avg: number | null; day30Avg: number | null }
  ): string => {
    const goalValue = getNumericGoalValue(metric);
    const currentAvg = stats.day7Avg; // Using 7-day average as "current"
    const thirtyDayAvg = stats.day30Avg;

    if (!currentAvg) return "No data";

    const trends = [];

    // Trend from goal
    if (goalValue !== null) {
      const goalDiff = currentAvg - goalValue;
      const goalTrend = goalDiff >= 0 ? "increase" : "decrease";
      trends.push(`${goalTrend} vs goal`);
    } else {
      trends.push("no goal");
    }

    // Trend from 30-day average
    if (thirtyDayAvg !== null) {
      const avgDiff = currentAvg - thirtyDayAvg;
      const avgTrend = avgDiff >= 0 ? "increase" : "decrease";
      trends.push(`${avgTrend} vs 30d`);
    } else {
      trends.push("no 30d");
    }

    return trends.join(", ");
  };

  const generateImage = async () => {
    if (!contentRef.current) return;

    setIsGenerating(true);
    try {
      // Preload all images to ensure they're fully loaded before capturing
      if (photos && photos.length > 0) {
        // console.log("Preloading images...");
        await Promise.all(
          photos.map((photo) => {
            return new Promise<void>((resolve) => {
              const img = new Image();

              // Set up the load handler first
              img.onload = () => {
                // console.log(`Successfully preloaded image: ${photo}`);
                resolve();
              };

              img.onerror = () => {
                console.warn(
                  `Failed to preload image: ${photo}, but continuing...`
                );
                resolve(); // Resolve instead of reject to continue with other images
              };

              // Only set crossOrigin if the image is from a different origin
              if (
                !photo.startsWith(window.location.origin) &&
                !photo.startsWith("data:")
              ) {
                img.crossOrigin = "anonymous";
              }

              // Set the src last to trigger loading
              img.src = photo;
            });
          })
        );
        // console.log("Images preloading completed");
      }

      // Import jsPDF dynamically to avoid SSR issues
      const { jsPDF } = await import("jspdf");

      // Create new PDF document (A4 size: 210 x 297 mm)
      const pdf = new jsPDF("portrait", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;

      // Find all page elements (direct children of contentRef)
      const pages = Array.from(contentRef.current.children) as HTMLElement[];
      // console.log(`Found ${pages.length} pages to render`);

      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i];
        // console.log(`Rendering page ${i + 1}/${pages.length}`);

        // Add new page for each page except the first
        if (i > 0) {
          pdf.addPage();
        }

        // Generate canvas for each individual page using html2canvas-pro
        const canvas = await html2canvas(pageElement, {
          useCORS: true,
          allowTaint: true, // Allow tainted canvas for better compatibility
          logging: true, // Enable logging to debug issues
          scale: 2, // Higher scale for better quality
          backgroundColor: "#ffffff",
          // html2canvas-pro specific options
          ignoreElements: (element: Element) => {
            // Only skip actual problematic elements
            return element.tagName === "SCRIPT";
          },
          // Better CSS support in pro version
          foreignObjectRendering: false,
          // Additional options for better image handling
          imageTimeout: 15000, // Wait up to 15 seconds for images to load
          onclone: (clonedDoc: Document) => {
            // Enable print color adjustment and fix image issues
            const style = clonedDoc.createElement("style");
            style.textContent = `
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              img {
                max-width: 100% !important;
                max-height: 100% !important;
                object-fit: contain !important;
              }
            `;
            clonedDoc.head.appendChild(style);

            // Fix images in the cloned document
            const images = clonedDoc.querySelectorAll("img");
            images.forEach((img) => {
              if (img instanceof HTMLImageElement) {
                // Remove crossOrigin to avoid CORS issues in html2canvas
                img.removeAttribute("crossorigin");

                // If it's a blob URL or data URL, leave it as is
                if (
                  img.src.startsWith("blob:") ||
                  img.src.startsWith("data:")
                ) {
                  return;
                }

                // For other images, ensure they're loaded
                const originalSrc = img.src;
                img.src = originalSrc;
              }
            });
          },
        });

        // Convert canvas to image data with high quality
        const imgData = canvas.toDataURL("image/png", 1.0); // Maximum quality

        // Calculate dimensions to fit the page properly
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasRatio = canvasWidth / canvasHeight;

        // Add margins
        const margin = 2; // 2mm margins
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

        // console.log(
        //   `Adding page ${
        //     i + 1
        //   } to PDF: ${imgWidth}x${imgHeight}mm at (${x}, ${y})`
        // );

        // Add image to PDF page
        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      }

      // Save the PDF
      const filename = `check-in-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      // console.log(`Saving PDF as: ${filename}`);
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const todayLog = dailyLogs?.find((d) => d.date === checkIn?.date);

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
                // Remove transform scale that might cause positioning issues
                // transform: "scale(0.85)",
                // transformOrigin: "top center",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
                // Add some margin for better modal display
                margin: "20px 0",
              }}
            >
              {/* Photo Pages - One photo per page */}
              {photos &&
                photos.length > 0 &&
                photos.map((photo, index) => (
                  <div
                    key={`photo-${index}`}
                    style={{
                      width: "816px", // 8.5 inches at 96 DPI
                      height: "1056px", // 11 inches at 96 DPI
                      padding: "24px",
                      boxSizing: "border-box",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#ffffff",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      marginBottom: "20px",
                    }}
                  >
                    {/* Photo Header */}
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
                          fontSize: "28px",
                          fontWeight: "bold",
                          color: "#1f2937",
                          marginBottom: "8px",
                          marginTop: "0",
                        }}
                      >
                        Gaynor Check-ins {checkIn?.date}
                      </h1>
                      <p
                        style={{
                          color: "#4b5563",
                          fontSize: "16px",
                          margin: "0",
                        }}
                      >
                        {todayLog && todayLog.weight && todayLog.bodyfat ? (
                          <span>
                            Weight: {todayLog.weight.toFixed(1)} lbs | Bodyfat:{" "}
                            {todayLog.bodyfat.toFixed(1)} %
                          </span>
                        ) : (
                          <span>No weight/bodyfat % data today.</span>
                        )}
                      </p>
                    </div>

                    {/* Photo Container */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                        border: "2px solid #e5e7eb",
                        padding: "20px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={photo}
                        alt={`Progress photo ${index + 1}`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          borderRadius: "4px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        onError={() => {
                          console.error(
                            `Failed to load image ${index + 1}:`,
                            photo
                          );
                        }}
                        onLoad={() => {
                          // console.log(`Image ${index + 1} loaded successfully`);
                        }}
                      />
                    </div>

                    {/* Photo Footer */}
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "20px",
                        padding: "12px",
                        backgroundColor: "#f0f9ff",
                        borderRadius: "6px",
                        border: "1px solid #bae6fd",
                      }}
                    >
                      <p
                        style={{
                          color: "#0369a1",
                          fontSize: "14px",
                          margin: "0",
                          fontWeight: "500",
                        }}
                      >
                        Photo {index + 1} of {photos.length}
                      </p>
                    </div>
                  </div>
                ))}

              {/* Health Metrics Report Page */}
              <div
                style={{
                  width: "816px", // 8.5 inches at 96 DPI
                  height: "1056px", // 11 inches at 96 DPI
                  padding: "24px",
                  boxSizing: "border-box",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#ffffff",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
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
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      marginBottom: "8px",
                      marginTop: "0",
                    }}
                  >
                    Gaynor Check-ins {checkIn?.date}
                  </h1>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "16px",
                      margin: "0",
                    }}
                  >
                    {todayLog && todayLog.weight && todayLog.bodyfat ? (
                      <span>
                        Weight: {todayLog.weight} lbs | Bodyfat:{" "}
                        {todayLog.bodyfat} %
                      </span>
                    ) : (
                      <span>No weight/bodyfat % data today.</span>
                    )}
                  </p>
                </div>
                {/* Weight Progress  */}
                <div
                  style={{
                    backgroundColor: "#fef3c7",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #fbbf24",
                    marginBottom: "16px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#d97706",
                      marginTop: "0",
                      marginBottom: "8px",
                    }}
                  >
                    Weight Log (30 Days)
                  </h2>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      height: "300px",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb",
                      overflow: "hidden",
                      padding: "2px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <WeightChart dailyLogs={dailyLogs || []} height={296} />
                  </div>
                </div>

                {/* Health Statistics Summary */}
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
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#166534",
                      marginTop: "0",
                      marginBottom: "12px",
                    }}
                  >
                    Health Metrics Summary
                  </h2>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "11px",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#bbf7d0" }}>
                        <th
                          style={{
                            padding: "6px",
                            textAlign: "left",
                            color: "#166534",
                            fontWeight: "600",
                            border: "1px solid #86efac",
                          }}
                        >
                          Metric
                        </th>
                        <th
                          style={{
                            padding: "6px",
                            textAlign: "center",
                            color: "#166534",
                            fontWeight: "600",
                            border: "1px solid #86efac",
                          }}
                        >
                          Goal
                        </th>
                        <th
                          style={{
                            padding: "6px",
                            textAlign: "center",
                            color: "#166534",
                            fontWeight: "600",
                            border: "1px solid #86efac",
                          }}
                        >
                          7-Day Avg
                        </th>
                        <th
                          style={{
                            padding: "6px",
                            textAlign: "center",
                            color: "#166534",
                            fontWeight: "600",
                            border: "1px solid #86efac",
                          }}
                        >
                          30-Day Avg
                        </th>
                        <th
                          style={{
                            padding: "5px",
                            textAlign: "center",
                            color: "#166534",
                            fontWeight: "600",
                            border: "1px solid #86efac",
                            width: "200px",
                            fontSize: "11px",
                          }}
                        >
                          Trends
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
                              <td
                                style={{
                                  padding: "5px 6px",
                                  textAlign: "center",
                                  color: "#374151",
                                  border: "1px solid #e5e7eb",
                                  fontSize: "11px",
                                }}
                              >
                                {getTrends(metric, stats)}
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
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Html2CanvasModal;
