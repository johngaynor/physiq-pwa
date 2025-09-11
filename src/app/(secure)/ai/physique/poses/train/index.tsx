"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/app/store/reducer";
import { Input, Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import {
  analyzePose,
  getPoses,
  assignPose,
} from "@/app/(secure)/physique/state/actions";
import { AnalyzePoseResult } from "@/app/(secure)/physique/state/types";
import ResultsLoadingCard from "./components/ResultsLoadingCard";
import { toast } from "sonner";

function mapStateToProps(state: RootState) {
  return {
    analyzePoseLoading: state.physique.analyzePoseLoading,
    poses: state.physique.poses,
    posesLoading: state.physique.posesLoading,
    assignPoseLoading: state.physique.assignPoseLoading,
  };
}

const connector = connect(mapStateToProps, {
  analyzePose,
  getPoses,
  assignPose,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const PoseTrainingDashboard: React.FC<PropsFromRedux> = ({
  analyzePoseLoading,
  analyzePose,
  poses,
  posesLoading,
  getPoses,
  assignPoseLoading,
  assignPose,
}) => {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = React.useState<
    AnalyzePoseResult[]
  >([]);
  const [selectedPoses, setSelectedPoses] = React.useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = React.useState<number>(0);

  // Refs for scrolling
  const topRef = React.useRef<HTMLDivElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // Current image data for easier access
  const currentFile = selectedFiles[currentImageIndex];
  const currentPreviewUrl = previewUrls[currentImageIndex];
  const currentAnalysisResult = analysisResults[currentImageIndex];
  const currentSelectedPose = selectedPoses[currentImageIndex] || "";

  const handleClearAll = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    setAnalysisResults([]);
    setSelectedPoses([]);
    setCurrentImageIndex(0);
    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    // Cleanup existing preview URLs
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    // Scroll back to top
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAssignPose = async () => {
    if (!currentSelectedPose || !currentAnalysisResult?.fileUploaded) {
      alert("Please select a pose before submitting");
      return;
    }

    try {
      await assignPose(
        currentAnalysisResult.fileUploaded,
        parseInt(currentSelectedPose)
      ).then(() => {
        toast.success("Pose assigned successfully!");

        // Move to next image or back to top if this was the last one
        if (currentImageIndex < selectedFiles.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
          // Scroll to results for next image
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        } else {
          // All images processed, scroll back to top
          topRef.current?.scrollIntoView({ behavior: "smooth" });
          handleClearAll();
        }
      });
    } catch (error) {
      console.error("Error assigning pose:", error);
      // TODO: Handle error properly
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Limit to 10 files
    if (files.length > 10) {
      alert("Please select a maximum of 10 images");
      return;
    }

    setSelectedFiles(files);
    setCurrentImageIndex(0);

    // Create preview URLs for all files
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Clear previous results
    setAnalysisResults([]);
    setSelectedPoses([]);
  };

  const handleSubmit = async () => {
    if (!currentFile) {
      alert("Please select files first");
      return;
    }

    try {
      // For now, analyze one image at a time.
      // TODO: Update this when API supports batch processing
      analyzePose(currentFile).then((data: AnalyzePoseResult) => {
        // Update analysis results for current image
        const newResults = [...analysisResults];
        newResults[currentImageIndex] = data;
        setAnalysisResults(newResults);

        // Set the predicted pose as the default selection for current image
        if (data.analysisResult?.result?.predicted_class_name && poses) {
          const predictedPose = poses.find(
            (pose) =>
              pose.name === data.analysisResult.result.predicted_class_name
          );
          if (predictedPose) {
            const newSelectedPoses = [...selectedPoses];
            newSelectedPoses[currentImageIndex] = predictedPose.id.toString();
            setSelectedPoses(newSelectedPoses);
          }
        }
        // Scroll to results section after analysis completes
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      });
    } catch (error) {
      console.error("Error analyzing pose:", error);
      // TODO: Handle error properly
    }
  };

  // Function to update selected pose for current image
  const setCurrentSelectedPose = (poseId: string) => {
    const newSelectedPoses = [...selectedPoses];
    newSelectedPoses[currentImageIndex] = poseId;
    setSelectedPoses(newSelectedPoses);
  };

  // Fetch poses on component mount
  React.useEffect(() => {
    if (!poses) {
      getPoses();
    }
  }, [poses, getPoses]);

  // Cleanup preview URL when component unmounts or file changes
  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  if (!poses || posesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="w-full mb-40">
      {/* Top reference for scrolling */}
      <div ref={topRef} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:h-[600px]">
        {/* Left Column - File Upload */}
        <Card className="w-full rounded-sm p-0 h-full">
          <CardContent className="p-8 h-full">
            <div className="flex flex-col items-center space-y-4 h-full">
              <Upload className="h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium">Upload Physique Photos</h3>
              <p className="text-sm text-gray-500 text-center">
                Select up to 10 photos to upload for physique tracking
              </p>

              <div className="w-full max-w-md space-y-4 flex-1 flex flex-col justify-center">
                {/* Image counter */}
                {selectedFiles.length > 0 && (
                  <div className="text-center text-sm text-gray-600">
                    Image {currentImageIndex + 1} of {selectedFiles.length}
                  </div>
                )}

                <div className="flex flex-col items-center space-y-2">
                  <div className="relative w-full max-w-xs h-64 border border-gray-200 rounded-lg overflow-hidden bg-transparent">
                    {currentPreviewUrl ? (
                      <img
                        src={currentPreviewUrl}
                        alt="Preview"
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-transparent">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-sm">
                          {selectedFiles.length === 0
                            ? "No images selected"
                            : "Select files to begin"}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {currentPreviewUrl ? "Preview" : "Image will appear here"}
                  </p>
                </div>

                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={!currentFile || analyzePoseLoading}
                >
                  {analyzePoseLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    `Analyze Image ${currentImageIndex + 1}`
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Poses List and Results */}
        <div className="h-full">
          {/* Analysis Results */}
          {analyzePoseLoading || assignPoseLoading ? (
            <ResultsLoadingCard />
          ) : currentAnalysisResult ? (
            <Card className="w-full rounded-sm p-0 h-full">
              <CardContent className="p-6 h-full flex flex-col">
                {/* Results reference for scrolling */}
                <div ref={resultsRef} />
                <h3 className="text-lg font-medium mb-4">
                  Analysis Results - Image {currentImageIndex + 1} of{" "}
                  {selectedFiles.length}
                </h3>
                <div className="space-y-2 flex-1 flex flex-col">
                  <h4 className="text-md font-semibold text-center">
                    {
                      currentAnalysisResult.analysisResult?.result
                        ?.predicted_class_name
                    }
                    {currentAnalysisResult.analysisResult?.result?.confidence &&
                      ` (${(
                        currentAnalysisResult.analysisResult.result.confidence *
                        100
                      ).toFixed(1)}% confidence)`}
                  </h4>
                  <div className="w-full rounded-lg border flex-1 flex flex-col">
                    <h5 className="text-sm font-medium mb-2 p-4 pb-0">
                      All Pose Probabilities:
                    </h5>
                    <div className="h-[350px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Pose</TableHead>
                            <TableHead className="text-right">
                              Probability
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentAnalysisResult.analysisResult?.result
                            ?.all_probabilities &&
                            Object.entries(
                              currentAnalysisResult.analysisResult.result
                                .all_probabilities
                            )
                              .sort(
                                ([, a], [, b]) => (b as number) - (a as number)
                              ) // Sort by probability descending
                              .map(([pose, probability]) => {
                                // Find the pose ID from the poses array
                                const poseObj = poses?.find(
                                  (p) => p.name === pose
                                );
                                const poseId = poseObj?.id.toString() || "";

                                return (
                                  <TableRow
                                    key={pose}
                                    className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                      pose ===
                                      currentAnalysisResult.analysisResult
                                        ?.result?.predicted_class_name
                                        ? "font-extrabold"
                                        : ""
                                    } ${
                                      currentSelectedPose === poseId
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      if (poseId) {
                                        setCurrentSelectedPose(poseId);
                                      }
                                    }}
                                  >
                                    <TableCell>{pose}</TableCell>
                                    <TableCell className="text-right">
                                      {((probability as number) * 100).toFixed(
                                        2
                                      )}
                                      %
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Pose Selection and Buttons */}
                  <div className="flex gap-3 items-end mt-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Select Correct Pose
                      </label>
                      <Select
                        value={currentSelectedPose}
                        onValueChange={setCurrentSelectedPose}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose the correct pose..." />
                        </SelectTrigger>
                        <SelectContent>
                          {poses?.map((pose) => (
                            <SelectItem
                              key={pose.id}
                              value={pose.id.toString()}
                            >
                              {pose.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleAssignPose}
                      disabled={!currentSelectedPose || assignPoseLoading}
                      className="shrink-0"
                    >
                      {assignPoseLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : selectedFiles.length > 1 ? (
                        `Submit & ${
                          currentImageIndex < selectedFiles.length - 1
                            ? "Next"
                            : "Finish"
                        }`
                      ) : (
                        "Submit"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClearAll}
                      className="shrink-0"
                    >
                      Reset All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full rounded-sm p-0 h-full">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center">
                <div className="text-gray-400 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                  <p className="text-sm">
                    Upload and submit a photo to see analysis results here
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default connector(PoseTrainingDashboard);
