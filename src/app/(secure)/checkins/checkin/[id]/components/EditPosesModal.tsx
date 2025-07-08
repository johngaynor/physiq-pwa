"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../../store/reducer";
import { assignPose } from "../../../state/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckInAttachment } from "../../../state/types";
import { Edit3 } from "lucide-react";

function mapStateToProps(state: RootState) {
  return {
    poses: state.checkins.poses,
    posesLoading: state.checkins.posesLoading,
    assignPoseLoading: state.checkins.assignPoseLoading,
  };
}

const connector = connect(mapStateToProps, {
  assignPose,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

interface EditPosesModalProps extends PropsFromRedux {
  attachments: CheckInAttachment[];
  children: React.ReactNode;
}

const EditPosesModal: React.FC<EditPosesModalProps> = ({
  attachments,
  children,
  poses,
  posesLoading,
  assignPoseLoading,
  assignPose,
}) => {
  const [open, setOpen] = React.useState(false);

  const handlePoseChange = async (attachmentId: number, poseId: string) => {
    if (!poseId || poseId === "none") return;

    try {
      await assignPose(attachmentId, parseInt(poseId));
    } catch (error) {
      console.error("Error assigning pose:", error);
    }
  };

  const getPoseName = (poseId?: number): string => {
    if (!poseId || !poses) return "No pose assigned";
    const pose = poses.find((p) => p.id === poseId);
    return pose?.name || "Unknown pose";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Edit Poses for Attachments
          </DialogTitle>
        </DialogHeader>

        {posesLoading ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Loading poses...</div>
          </div>
        ) : !poses || poses.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">No poses available</div>
          </div>
        ) : (
          <div className="space-y-6">
            {attachments.map((attachment, index) => {
              const isImage = attachment.s3Filename?.match(
                /\.(jpg|jpeg|png|gif|webp)$/i
              );

              // Use blob data if available, otherwise fall back to URL
              let imageUrl: string | undefined;
              if (attachment.blob?.data && attachment.blob?.contentType) {
                imageUrl = `data:${attachment.blob.contentType};base64,${attachment.blob.data}`;
              } else {
                imageUrl = attachment.url;
              }

              return (
                <div
                  key={attachment.id || index}
                  className="border rounded-lg p-4"
                >
                  <div className="flex gap-4">
                    {/* Attachment Preview */}
                    <div className="w-24 h-24 flex-shrink-0">
                      {isImage && imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={
                            attachment.s3Filename || `Attachment ${index + 1}`
                          }
                          className="w-full h-full object-cover rounded border"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center border rounded bg-gray-50">
                          <div className="text-2xl mb-1">📄</div>
                          <div className="text-xs text-center font-medium truncate w-full px-1">
                            FILE
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Attachment Info and Pose Selection */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Filename
                        </Label>
                        <div className="text-sm text-gray-600 truncate">
                          {attachment.s3Filename || "Unknown file"}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Current Pose
                        </Label>
                        <div className="text-sm text-gray-600">
                          {getPoseName(attachment.poseId)}
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor={`pose-${attachment.id}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          Assign Pose
                        </Label>
                        <Select
                          disabled={assignPoseLoading}
                          onValueChange={(value) =>
                            handlePoseChange(attachment.id!, value)
                          }
                          defaultValue={attachment.poseId?.toString() || "none"}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select a pose..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              No pose assigned
                            </SelectItem>
                            {poses.map((pose) => (
                              <SelectItem
                                key={pose.id}
                                value={pose.id!.toString()}
                              >
                                {pose.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {attachments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No attachments found for this check-in.
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={assignPoseLoading}
          >
            {assignPoseLoading ? "Saving..." : "Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default connector(EditPosesModal);
