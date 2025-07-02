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
      // Import jsPDF dynamically to avoid SSR issues
      const { jsPDF } = await import('jspdf');
      
      // Create new PDF document (A4 size: 210 x 297 mm)
      const pdf = new jsPDF('portrait', 'mm', 'a4');
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
          logging: false
        });

        // Convert canvas to image data
        const imgData = canvas.toDataURL('image/png', 0.95); // Slightly compressed
        
        // Calculate dimensions to fit the page properly
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasRatio = canvasWidth / canvasHeight;
        
        // Add margins
        const margin = 10; // 10mm margins
        const maxWidth = pageWidth - (margin * 2);
        const maxHeight = pageHeight - (margin * 2);
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
        
        console.log(`Adding page ${i + 1} to PDF: ${imgWidth}x${imgHeight}mm at (${x}, ${y})`);
        
        // Add image to PDF page
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      }

      // Save the PDF
      const filename = `check-in-report-${new Date().toISOString().split("T")[0]}.pdf`;
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
              {/* Simple single page with "hi" */}
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
                <h1
                  style={{
                    fontSize: "48px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  hi
                </h1>
              </div>
              </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Html2CanvasModal;
