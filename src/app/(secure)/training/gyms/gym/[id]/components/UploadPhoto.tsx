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
import { Upload, Camera } from "lucide-react";

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
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(
    null
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedFiles(e.target.files);
  }

  function handleSubmit() {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("gymId", gymId.toString());

    // Append all selected files
    Array.from(selectedFiles).forEach((file, index) => {
      formData.append(`photos`, file);
    });

    onUpload(formData);
    handleClose();
  }

  function handleClose() {
    setOpen(false);
    setSelectedFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const fileCount = selectedFiles ? selectedFiles.length : 0;
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
      <DialogContent className="sm:max-w-[500px]">
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
                className="cursor-pointer"
              />
              {hasFiles && (
                <p className="text-sm text-muted-foreground mt-2">
                  {fileCount} file{fileCount !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>

          {hasFiles && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
              <ul className="text-sm space-y-1">
                {Array.from(selectedFiles!).map((file, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Upload className="h-3 w-3" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </li>
                ))}
              </ul>
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
