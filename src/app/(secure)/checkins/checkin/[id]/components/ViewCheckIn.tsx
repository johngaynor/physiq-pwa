"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../../store/reducer";
import { deleteCheckIn } from "../../../state/actions";
import { Card, CardContent } from "@/components/ui/card";
import { H3, Button } from "@/components/ui";
import {
  Edit,
  Calendar,
  MessageSquare,
  Utensils,
  Dumbbell,
  Camera,
} from "lucide-react";
import { CheckIn, CheckInAttachment } from "../../../state/types";
import { DailyLog } from "@/app/(secure)/health/state/types";
import { DietLog } from "@/app/(secure)/diet/state/types";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ConfirmDeleteCheckIn from "./ConfirmDeleteCheckIn";
import Html2CanvasModal from "./Html2CanvasModal";

// Utility functions for calculating statistics
const calculateMetricAverage = (
  dailyLogs: DailyLog[] | null,
  metricField: keyof DailyLog,
  days: number,
  checkInDate: string | null
): number | null => {
  if (!dailyLogs || dailyLogs.length === 0) return null;

  const now = DateTime.fromISO(checkInDate || DateTime.now().toISO());
  const cutoffDate = now.minus({ days });

  const relevantLogs = dailyLogs.filter((log) => {
    const logDate = DateTime.fromISO(log.date);
    return logDate >= cutoffDate && logDate <= now;
  });

  const validValues = relevantLogs
    .map((log) => log[metricField] as number)
    .filter((value) => value !== null && value !== undefined && !isNaN(value));

  if (validValues.length === 0) return null;

  const sum = validValues.reduce((acc, value) => acc + value, 0);
  return sum / validValues.length;
};

function mapStateToProps(state: RootState) {
  return {
    checkIns: state.checkins.checkIns,
    dailyLogs: state.health.dailyLogs,
    poses: state.checkins.poses,
  };
}

const connector = connect(mapStateToProps, {
  deleteCheckIn,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

interface ViewCheckInProps extends PropsFromRedux {
  checkIn?: CheckIn;
  setEditCheckIn: (edit: boolean) => void;
  attachments?: CheckInAttachment[];
  dailyLogs: DailyLog[] | null;
  dietLog?: DietLog | null;
}

const ViewCheckIn: React.FC<ViewCheckInProps> = ({
  checkIn,
  setEditCheckIn,
  deleteCheckIn,
  attachments = [],
  dailyLogs = [],
  dietLog,
  poses,
}) => {
  const router = useRouter();

  // Helper function to get pose name by ID
  const getPoseName = (poseId?: number): string => {
    if (!poseId || !poses) return "Missing pose label";
    const pose = poses.find((p) => p.id === poseId);
    return pose?.name || "Missing pose label";
  };

  if (!checkIn) {
    return (
      <div className="w-full">
        <Card className="w-full rounded-sm p-0">
          <CardContent className="p-4">
            <p>
              There was no check-in found with this ID. If you think this was a
              mistake, please contact your coach.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate 7-day and 30-day averages for health metrics
  const metrics = [
    "calories",
    "water",
    "steps",
    "totalSleep",
    "weight",
  ] as const;

  const healthStats = metrics.reduce((acc, metric) => {
    acc[metric] = {
      day7Avg: calculateMetricAverage(dailyLogs, metric, 7, checkIn.date),
      day30Avg: calculateMetricAverage(dailyLogs, metric, 30, checkIn.date),
    };
    return acc;
  }, {} as Record<(typeof metrics)[number], { day7Avg: number | null; day30Avg: number | null }>);

  return (
    <div className="w-full mb-20">
      <Card className="w-full rounded-sm p-0">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <div>
              <H3 className="mb-2">Check-In Details</H3>
              <div className="flex items-center text-gray-600 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {DateTime.fromISO(checkIn.date).toFormat("LLLL d, yyyy")}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Html2CanvasModal
                photos={attachments
                  ?.filter((attachment) => {
                    // Only include image attachments
                    const isImage = attachment.s3Filename?.match(
                      /\.(jpg|jpeg|png|gif|webp)$/i
                    );
                    return isImage && (attachment.blob?.data || attachment.url);
                  })
                  .map((attachment) => {
                    // Use blob data if available, otherwise fall back to URL
                    if (attachment.blob?.data && attachment.blob?.contentType) {
                      return `data:${attachment.blob.contentType};base64,${attachment.blob.data}`;
                    }
                    return attachment.url!;
                  })}
                healthStats={healthStats}
                dietLog={dietLog}
                checkIn={checkIn}
                dailyLogs={dailyLogs}
              >
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </Html2CanvasModal>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditCheckIn(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <ConfirmDeleteCheckIn
                onDelete={() => {
                  deleteCheckIn(checkIn.id!)
                    .then(() => {
                      router.push("/checkins");
                    })
                    .catch((error: any) => {
                      console.error("Error deleting check-in:", error);
                    });
                }}
              />
            </div>
          </div>
          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Training Information */}
            {checkIn.training && (
              <div className="space-y-2">
                <div className="flex items-center text-lg font-semibold">
                  <Dumbbell className="h-5 w-5 mr-2 text-blue-600" />
                  Training
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {checkIn.training}
                </p>
              </div>
            )}

            {/* Cheats Information */}
            {checkIn.cheats && (
              <div className="space-y-2">
                <div className="flex items-center text-lg font-semibold">
                  <Utensils className="h-5 w-5 mr-2 text-orange-600" />
                  Cheats
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {checkIn.cheats}
                </p>
              </div>
            )}

            {/* Comments */}
            {checkIn.comments && (
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center text-lg font-semibold">
                  <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                  Comments
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {checkIn.comments}
                </p>
              </div>
            )}

            {/* Attachments */}
            {attachments && attachments.length > 0 && (
              <div className="space-y-4 md:col-span-2">
                <div className="flex items-center text-lg font-semibold">
                  <Edit className="h-5 w-5 mr-2 text-purple-600" />
                  Attachments ({attachments.length})
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                        className="relative group border rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="aspect-square relative">
                          {isImage && imageUrl ? (
                            // Use regular img tag for base64 data, Next.js Image for URLs
                            imageUrl.startsWith("data:") ? (
                              <img
                                src={imageUrl}
                                alt={
                                  attachment.s3Filename ||
                                  `Attachment ${index + 1}`
                                }
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  console.error(
                                    `Image failed to load: ${attachment.s3Filename}`,
                                    e
                                  );
                                  // Fallback to file icon if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const poseName = getPoseName(
                                      attachment.poseId
                                    );
                                    parent.innerHTML = `
                                      <div class="flex flex-col items-center justify-center h-full p-4">
                                        <div class="text-4xl mb-2">📄</div>
                                        <div class="text-sm text-center font-medium truncate w-full">
                                          ${poseName}
                                        </div>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            ) : (
                              <Image
                                src={imageUrl}
                                alt={
                                  attachment.s3Filename ||
                                  `Attachment ${index + 1}`
                                }
                                fill
                                className="object-cover rounded-lg"
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                unoptimized={true}
                                onError={(e) => {
                                  console.error(
                                    `Image failed to load: ${attachment.s3Filename}`,
                                    e
                                  );
                                  // Fallback to file icon if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const poseName = getPoseName(
                                      attachment.poseId
                                    );
                                    parent.innerHTML = `
                                      <div class="flex flex-col items-center justify-center h-full p-4">
                                        <div class="text-4xl mb-2">📄</div>
                                        <div class="text-sm text-center font-medium truncate w-full">
                                          ${poseName}
                                        </div>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            )
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full p-4">
                              <div className="text-4xl mb-2">📄</div>
                              <div className="text-sm text-center font-medium truncate w-full">
                                {getPoseName(attachment.poseId)}
                              </div>
                            </div>
                          )}
                        </div>
                        {/* File info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-xs truncate">
                            {getPoseName(attachment.poseId)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Empty state if no content */}
          {!checkIn.training && (!attachments || attachments.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>This check-in doesn&apos;t have any additional information.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default connector(ViewCheckIn);
