"use client";
import React from "react";
import { Input, Label, Button } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Camera, X } from "lucide-react";

type UploadPhotoProps = {
  Trigger: React.ReactNode;
  gymId: number;
  onUpload: (formData: FormData) => void;
  uploading?: boolean;
};

export function UploadPhoto({
  Trigger,
  gymId,
  onUpload,
  uploading = false,
}: UploadPhotoProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  }

  function removeFile(indexToRemove: number) {
    const newFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedFiles(newFiles);

    // Reset the input value to allow re-selecting the same files
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit() {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("gymId", gymId.toString());

    // Append all selected files with the correct field name "images" to match backend
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    onUpload(formData);
    handleClose();
  }

  function handleClose() {
    setOpen(false);
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const fileCount = selectedFiles.length;
  const hasFiles = fileCount > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
        else setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Upload Gym Photos
          </DialogTitle>
          <DialogDescription>
            Select one or more photos to upload for this gym. Accepted formats:
            JPG, PNG, GIF, WebP.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photos" className="text-right">
              Photos
            </Label>
            <div className="col-span-3">
              <Input
                ref={fileInputRef}
                id="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {hasFiles && (
                <p className="text-sm text-muted-foreground mt-2">
                  {fileCount} file{fileCount !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>

          {/* Display selected files with previews */}
          {hasFiles && (
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-4">
                {selectedFiles.map((file, index) => {
                  const isImage = file.type.startsWith("image/");

                  return (
                    <div
                      key={index}
                      className="w-full h-32 border rounded-lg p-2 bg-gray-50 relative group hover:bg-gray-100 transition-colors"
                    >
                      {/* Image Preview */}
                      {isImage && (
                        <div className="w-full h-full mb-1">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover rounded border"
                          />
                        </div>
                      )}

                      {/* Non-image file icon/placeholder */}
                      {!isImage && (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 mb-1">
                          <div className="text-4xl mb-2">📄</div>
                          <div className="text-sm text-center font-medium truncate w-full px-1">
                            {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                          </div>
                        </div>
                      )}

                      {/* File Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-sm truncate">{file.name}</div>
                        <div className="text-xs opacity-75">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white border-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!hasFiles || uploading}
          >
            {uploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload{" "}
                {fileCount > 0
                  ? `${fileCount} Photo${fileCount !== 1 ? "s" : ""}`
                  : "Photos"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
