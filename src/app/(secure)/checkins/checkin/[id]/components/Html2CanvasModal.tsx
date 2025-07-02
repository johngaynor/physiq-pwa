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

interface Html2CanvasModalProps {
  children: React.ReactNode;
  photos?: string[];
}

const Html2CanvasModal: React.FC<Html2CanvasModalProps> = ({
  children,
  photos,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const generateImage = async () => {
    if (!contentRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc: Document) => {
          // Override all potentially problematic CSS with safe RGB values
          const style = clonedDoc.createElement("style");
          style.textContent = `
            * {
              color: rgb(0, 0, 0) !important;
              background-color: transparent !important;
              border-color: rgb(229, 231, 235) !important;
            }
            body {
              background-color: rgb(255, 255, 255) !important;
            }
            /* Override any Tailwind or other framework colors */
            .bg-white, [style*="backgroundColor: '#ffffff'"] {
              background-color: rgb(255, 255, 255) !important;
            }
            [style*="backgroundColor: '#eff6ff'"] {
              background-color: rgb(239, 246, 255) !important;
            }
            [style*="backgroundColor: '#f0fdf4'"] {
              background-color: rgb(240, 253, 244) !important;
            }
            [style*="backgroundColor: '#faf5ff'"] {
              background-color: rgb(250, 245, 255) !important;
            }
            [style*="color: '#1f2937'"] {
              color: rgb(31, 41, 55) !important;
            }
            [style*="color: '#4b5563'"] {
              color: rgb(75, 85, 99) !important;
            }
            [style*="color: '#1e40af'"] {
              color: rgb(30, 64, 175) !important;
            }
            [style*="color: '#166534'"] {
              color: rgb(22, 101, 52) !important;
            }
            [style*="color: '#16a34a'"] {
              color: rgb(22, 163, 74) !important;
            }
            [style*="color: '#6b21a8'"] {
              color: rgb(107, 33, 168) !important;
            }
            [style*="color: '#9333ea'"] {
              color: rgb(147, 51, 234) !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        },
      } as any);

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `check-in-report-${
            new Date().toISOString().split("T")[0]
          }.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error("Error generating image:", error);
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
            Generate Report Image
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
              {isGenerating ? "Generating..." : "Download Image"}
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
              {/* Photo Pages - Dynamic mapping */}
              {photos && photos.length > 0 ? (
                photos.map((photo, index) => (
                  <div
                    key={index}
                    style={{
                      width: "816px", // 8.5 inches at 96 DPI
                      height: "1056px", // 11 inches at 96 DPI
                      padding: "48px", // ~0.5 inch margins
                      boxSizing: "border-box",
                      border: "1px solid #e5e7eb",
                      position: "relative",
                      pageBreakAfter: "always",
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
                          fontSize: "28px",
                          fontWeight: "bold",
                          color: "#1f2937",
                          marginBottom: "8px",
                          marginTop: "0",
                        }}
                      >
                        Check-In Report - Photo {index + 1}
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

                    {/* Full Page Photo */}
                    <div
                      style={{
                        flex: "1",
                        backgroundColor: "#f8fafc",
                        border: "2px solid #e2e8f0",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={photo}
                        alt={`Check-in Photo ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    {/* Footer */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "24px",
                        left: "48px",
                        right: "48px",
                        textAlign: "center",
                        borderTop: "1px solid #e5e7eb",
                        paddingTop: "12px",
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      Generated by Physiq Web App • Page {index + 1} of{" "}
                      {photos.length + 2}
                    </div>
                  </div>
                ))
              ) : (
                // No photos available
                <div
                  style={{
                    width: "816px",
                    height: "1056px",
                    padding: "48px",
                    boxSizing: "border-box",
                    border: "1px solid #e5e7eb",
                    position: "relative",
                    pageBreakAfter: "always",
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
                        fontSize: "28px",
                        fontWeight: "bold",
                        color: "#1f2937",
                        marginBottom: "8px",
                        marginTop: "0",
                      }}
                    >
                      Check-In Report - Photos
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

                  {/* No Photos Message */}
                  <div
                    style={{
                      flex: "1",
                      backgroundColor: "#f8fafc",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "24px",
                        color: "#64748b",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      No Photos Available
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "24px",
                      left: "48px",
                      right: "48px",
                      textAlign: "center",
                      borderTop: "1px solid #e5e7eb",
                      paddingTop: "12px",
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    Generated by Physiq Web App • Page 1 of 3
                  </div>
                </div>
              )}

              {/* Page 4 - Health Metrics and General Info */}
              <div
                style={{
                  width: "816px",
                  height: "1056px",
                  padding: "48px",
                  boxSizing: "border-box",
                  border: "1px solid #e5e7eb",
                  position: "relative",
                  pageBreakAfter: "always",
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
                    Health Metrics & Information
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

                {/* Content */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                  }}
                >
                  {/* Health Metrics */}
                  <div
                    style={{
                      backgroundColor: "#f0fdf4",
                      padding: "24px",
                      borderRadius: "12px",
                      border: "2px solid #bbf7d0",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "#166534",
                        marginTop: "0",
                        marginBottom: "20px",
                      }}
                    >
                      Health Metrics
                    </h2>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                        fontSize: "18px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #bbf7d0",
                          paddingBottom: "10px",
                        }}
                      >
                        <span style={{ color: "#374151" }}>Weight:</span>
                        <span style={{ fontWeight: "600", color: "#166534" }}>
                          185 lbs
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #bbf7d0",
                          paddingBottom: "10px",
                        }}
                      >
                        <span style={{ color: "#374151" }}>Body Fat:</span>
                        <span style={{ fontWeight: "600", color: "#166534" }}>
                          15.2%
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: "#374151" }}>Muscle Mass:</span>
                        <span style={{ fontWeight: "600", color: "#166534" }}>
                          165 lbs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* General Information */}
                  <div
                    style={{
                      backgroundColor: "#fef3c7",
                      padding: "24px",
                      borderRadius: "12px",
                      border: "2px solid #fcd34d",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "#92400e",
                        marginTop: "0",
                        marginBottom: "20px",
                      }}
                    >
                      General Information
                    </h2>
                    <div
                      style={{
                        fontSize: "18px",
                        color: "#374151",
                        lineHeight: "1.8",
                      }}
                    >
                      <p style={{ margin: "0 0 15px 0" }}>
                        <strong>Training:</strong> Upper body strength training
                      </p>
                      <p style={{ margin: "0 0 15px 0" }}>
                        <strong>Sleep:</strong> 7.5 hours
                      </p>
                      <p style={{ margin: "0" }}>
                        <strong>Energy Level:</strong> High
                      </p>
                    </div>
                  </div>

                  {/* Weight Graph */}
                  <div
                    style={{
                      backgroundColor: "#eff6ff",
                      padding: "24px",
                      borderRadius: "12px",
                      border: "2px solid #bfdbfe",
                      height: "250px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "#1e40af",
                        marginTop: "0",
                        marginBottom: "20px",
                      }}
                    >
                      Weight Progress (30 Days)
                    </h2>
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        height: "calc(100% - 60px)",
                        borderRadius: "8px",
                        border: "2px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        color: "#64748b",
                      }}
                    >
                      [Weight Graph Placeholder]
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "24px",
                    left: "48px",
                    right: "48px",
                    textAlign: "center",
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "12px",
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  Generated by Physiq Web App • Page {(photos?.length || 0) + 1}{" "}
                  of {(photos?.length || 0) + 2}
                </div>
              </div>

              {/* Page 5 - Statistics Table */}
              <div
                style={{
                  width: "816px",
                  height: "1056px",
                  padding: "48px",
                  boxSizing: "border-box",
                  border: "1px solid #e5e7eb",
                  position: "relative",
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
                    Statistics Summary
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

                {/* Statistics Table */}
                <div
                  style={{
                    backgroundColor: "#faf5ff",
                    padding: "24px",
                    borderRadius: "12px",
                    border: "2px solid #e9d5ff",
                    flex: "1",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "#6b21a8",
                      marginTop: "0",
                      marginBottom: "20px",
                    }}
                  >
                    Statistics
                  </h2>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "16px",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#e9d5ff" }}>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "left",
                            color: "#6b21a8",
                            fontWeight: "600",
                          }}
                        >
                          Metric
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            color: "#6b21a8",
                            fontWeight: "600",
                          }}
                        >
                          Goal
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            color: "#6b21a8",
                            fontWeight: "600",
                          }}
                        >
                          Actual
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            color: "#6b21a8",
                            fontWeight: "600",
                          }}
                        >
                          Last 30
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "left",
                            color: "#6b21a8",
                            fontWeight: "600",
                          }}
                        >
                          Comments
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ backgroundColor: "#ffffff" }}>
                        <td style={{ padding: "10px 12px", color: "#374151" }}>
                          Calories
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          2000
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          2150
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          1980
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            color: "#374151",
                            fontSize: "14px",
                          }}
                        >
                          Higher than goal, higher than last 30
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: "#f9fafb" }}>
                        <td style={{ padding: "10px 12px", color: "#374151" }}>
                          Water
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          8 cups
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          7 cups
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          6.5 cups
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            color: "#374151",
                            fontSize: "14px",
                          }}
                        >
                          Below goal, above last 30
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: "#ffffff" }}>
                        <td style={{ padding: "10px 12px", color: "#374151" }}>
                          Steps
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          10,000
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          12,500
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          9,800
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            color: "#374151",
                            fontSize: "14px",
                          }}
                        >
                          Above goal, higher than last 30
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: "#f9fafb" }}>
                        <td style={{ padding: "10px 12px", color: "#374151" }}>
                          Sleep
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          8 hrs
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          7.5 hrs
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          7.2 hrs
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            color: "#374151",
                            fontSize: "14px",
                          }}
                        >
                          Below goal, above last 30
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: "#ffffff" }}>
                        <td style={{ padding: "10px 12px", color: "#374151" }}>
                          Body Fat %
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          15%
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          15.2%
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: "#374151",
                          }}
                        >
                          15.8%
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            color: "#374151",
                            fontSize: "14px",
                          }}
                        >
                          Slightly above goal, improving
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "24px",
                    left: "48px",
                    right: "48px",
                    textAlign: "center",
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "12px",
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  Generated by Physiq Web App • Page {(photos?.length || 0) + 2}{" "}
                  of {(photos?.length || 0) + 2}
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
