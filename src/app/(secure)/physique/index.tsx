"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Input, Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

function mapStateToProps(state: RootState) {
  return {
    // We can keep this for future use
  };
}

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const PhysiqueDashboard: React.FC<PropsFromRedux> = ({}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    // TODO: Implement file upload logic
    console.log("File to upload:", selectedFile);
    alert(`File selected: ${selectedFile.name}`);
  };

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
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {selectedFile && (
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                  Selected: {selectedFile.name}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={!selectedFile}
              >
                Submit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default connector(PhysiqueDashboard);
