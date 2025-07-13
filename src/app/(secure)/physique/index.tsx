"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Input, Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { analyzePose } from "./state/actions";

function mapStateToProps(state: RootState) {
  return {
    analyzePoseLoading: state.physique.analyzePoseLoading,
  };
}

const connector = connect(mapStateToProps, { analyzePose });
type PropsFromRedux = ConnectedProps<typeof connector>;

const PhysiqueDashboard: React.FC<PropsFromRedux> = ({
  analyzePoseLoading,
  analyzePose,
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = React.useState<any>(null);

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
      analyzePose(selectedFile).then((data) => {
        setAnalysisResult(data);
      });
    } catch (error) {
      console.error("Error analyzing pose:", error);
      // TODO: Handle error properly
    }
  };

  // Cleanup preview URL when component unmounts or file changes
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="w-full">
      <Card className="w-full rounded-sm p-0">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium">Upload Physique Photo</h3>
            <p className="text-sm text-gray-500 text-center">
              Select a photo to upload for physique tracking
            </p>

            <div className="w-full max-w-md space-y-4">
              {previewUrl && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative w-full max-w-xs">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Preview</p>
                </div>
              )}

              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {analysisResult && (
                <div className="w-full space-y-3">
                  <h3 className="text-lg font-semibold text-center">
                    {
                      analysisResult.analysisResult?.prediction
                        ?.predicted_class_name
                    }
                    {analysisResult.analysisResult?.prediction?.confidence &&
                      ` (${(
                        analysisResult.analysisResult.prediction.confidence *
                        100
                      ).toFixed(1)}% confidence)`}
                  </h3>
                  <div className="w-full p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Analysis Result:
                    </h4>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40">
                      {JSON.stringify(analysisResult, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

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
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default connector(PhysiqueDashboard);
