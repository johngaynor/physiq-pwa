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

const PhysiqueDashboard: React.FC<PropsFromRedux> = ({
  analyzePoseLoading,
  analyzePose,
  poses,
  posesLoading,
  getPoses,
  assignPoseLoading,
  assignPose,
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    React.useState<AnalyzePoseResult | null>(null);
  const [selectedPose, setSelectedPose] = React.useState<string>("");

  const handleClearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setSelectedPose("");
    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleAssignPose = async () => {
    if (!selectedPose || !analysisResult?.fileUploaded) {
      alert("Please select a pose before submitting");
      return;
    }

    try {
      await assignPose(analysisResult.fileUploaded, parseInt(selectedPose));
      // Optionally show success message or clear the form
      handleClearAll();
    } catch (error) {
      console.error("Error assigning pose:", error);
      // TODO: Handle error properly
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    // Create preview URL
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Clear previous result when new file is selected
    setAnalysisResult(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    try {
      analyzePose(selectedFile).then((data: AnalyzePoseResult) => {
        setAnalysisResult(data);
        // Set the predicted pose as the default selection
        if (data.analysisResult?.prediction?.predicted_class_name && poses) {
          const predictedPose = poses.find(
            (pose) =>
              pose.name === data.analysisResult.prediction.predicted_class_name
          );
          if (predictedPose) {
            setSelectedPose(predictedPose.id.toString());
          }
        }
      });
    } catch (error) {
      console.error("Error analyzing pose:", error);
      // TODO: Handle error properly
    }
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
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!poses || posesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        {/* Left Column - File Upload */}
        <Card className="w-full rounded-sm p-0 h-full">
          <CardContent className="p-8 h-full">
            <div className="flex flex-col items-center space-y-4 h-full">
              <Upload className="h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium">Upload Physique Photo</h3>
              <p className="text-sm text-gray-500 text-center">
                Select a photo to upload for physique tracking
              </p>

              <div className="w-full max-w-md space-y-4 flex-1 flex flex-col justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative w-full max-w-xs h-64 border border-gray-200 rounded-lg overflow-hidden bg-transparent">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-transparent">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-sm">No image selected</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {previewUrl ? "Preview" : "Image will appear here"}
                  </p>
                </div>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={!selectedFile || analyzePoseLoading}
                >
                  {analyzePoseLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Poses List and Results */}
        <div className="h-full">
          {/* Analysis Results */}
          {analyzePoseLoading ? (
            <ResultsLoadingCard />
          ) : analysisResult ? (
            <Card className="w-full rounded-sm p-0 h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
                <div className="space-y-2 flex-1 flex flex-col">
                  <h4 className="text-md font-semibold text-center">
                    {
                      analysisResult.analysisResult?.prediction
                        ?.predicted_class_name
                    }
                    {analysisResult.analysisResult?.prediction?.confidence &&
                      ` (${(
                        analysisResult.analysisResult.prediction.confidence *
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
                          {analysisResult.analysisResult?.prediction
                            ?.all_probabilities &&
                            Object.entries(
                              analysisResult.analysisResult.prediction
                                .all_probabilities
                            )
                              .sort(([, a], [, b]) => b - a) // Sort by probability descending
                              .map(([pose, probability]) => (
                                <TableRow
                                  key={pose}
                                  className={
                                    pose ===
                                    analysisResult.analysisResult?.prediction
                                      ?.predicted_class_name
                                      ? "font-extrabold"
                                      : ""
                                  }
                                >
                                  <TableCell>{pose}</TableCell>
                                  <TableCell className="text-right">
                                    {(probability * 100).toFixed(2)}%
                                  </TableCell>
                                </TableRow>
                              ))}
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
                        value={selectedPose}
                        onValueChange={setSelectedPose}
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
                      disabled={!selectedPose || assignPoseLoading}
                      className="shrink-0"
                    >
                      {assignPoseLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClearAll}
                      className="shrink-0"
                    >
                      Reset
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

export default connector(PhysiqueDashboard);
