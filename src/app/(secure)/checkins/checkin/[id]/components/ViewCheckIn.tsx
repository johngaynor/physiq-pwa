"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../../store/reducer";
import { addCheckInComment, deleteCheckIn } from "../../../state/actions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { H3, Button, Input } from "@/components/ui";
import {
  Edit,
  Camera,
  FileSpreadsheet,
  Carrot,
  MessageSquare,
  Send,
} from "lucide-react";
import {
  CheckIn,
  CheckInAttachment,
  CheckInComment,
} from "../../../state/types";
import { DailyLog } from "@/app/(secure)/health/state/types";
import { DietLog } from "@/app/(secure)/diet/state/types";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ConfirmDeleteCheckIn from "./ConfirmDeleteCheckIn";
import Html2CanvasModal from "./Html2CanvasModal";
import EditPosesModal from "./EditPosesModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FieldValue } from "@/app/(secure)/diet/log/[id]/components/FieldValues";
import { StatisticsGraph } from "@/app/(secure)/health/components/StatisticsGraph";

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
    comments: state.checkins.comments,
    addCommentLoading: state.checkins.addCommentLoading,
  };
}

const connector = connect(mapStateToProps, {
  deleteCheckIn,
  addCheckInComment,
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
  checkIns,
  comments,
  addCheckInComment,
  addCommentLoading,
}) => {
  const router = useRouter();
  const [newComment, setNewComment] = React.useState("");

  function addComment() {
    if (!checkIn?.id || !newComment.trim()) return;
    addCheckInComment(checkIn.id, newComment.trim())
      .then(() => {
        setNewComment("");
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  }

  // Helper function to get pose name by ID
  const getPoseName = (poseId?: number): string => {
    if (!poseId || !poses) return "Missing pose label";
    const pose = poses.find((p) => p.id === poseId);
    return pose?.name || "Missing pose label";
  };

  const lastCheckIn = React.useMemo(() => {
    if (!checkIn || !checkIns) return null;

    const sortedCheckIns = [...checkIns].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    const index = sortedCheckIns.findIndex((c) => c.id === checkIn.id);
    return sortedCheckIns[index - 1] || null;
  }, [checkIn]);

  const filteredDailyLogs = React.useMemo(() => {
    if (!dailyLogs || !checkIn) return [];

    const end = checkIn.date;
    const start = lastCheckIn ? lastCheckIn.date : null;

    return dailyLogs.filter((dl) => {
      const date = dl.date;
      return start ? date > start && date <= end : date <= end;
    });
  }, [dailyLogs, checkIn, lastCheckIn]);

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
        <CardContent className="flex flex-col md:flex-row justify-between grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div>
            <StatisticsGraph
              dailyLogs={filteredDailyLogs}
              title="Weight Changes this Check-In"
              unit="lbs"
              dataKeys={["weight"]}
              showUnit
              rounding={2}
              primaryKey="weight"
              subtitle="this check-in"
            />
          </div>
          <div>
            <div className="mb-6 flex justify-between items-center">
              <H3>Check-In #{checkIn.id}</H3>
              <div>
                <Html2CanvasModal
                  photos={attachments
                    ?.filter((attachment) => {
                      // Only include image attachments
                      const isImage = attachment.s3Filename?.match(
                        /\.(jpg|jpeg|png|gif|webp)$/i
                      );
                      return (
                        isImage && (attachment.blob?.data || attachment.url)
                      );
                    })
                    .map((attachment) => {
                      // Use blob data if available, otherwise fall back to URL
                      if (
                        attachment.blob?.data &&
                        attachment.blob?.contentType
                      ) {
                        return `data:${attachment.blob.contentType};base64,${attachment.blob.data}`;
                      }
                      return attachment.url!;
                    })}
                  healthStats={healthStats}
                  dietLog={dietLog}
                  checkIn={checkIn}
                  dailyLogs={dailyLogs}
                >
                  <Button variant="outline">
                    <FileSpreadsheet className="font-extrabold" />
                  </Button>
                </Html2CanvasModal>
                {attachments && attachments.length > 0 && (
                  <EditPosesModal attachments={attachments}>
                    <Button className="ml-2" variant="outline">
                      <Camera className="font-extrabold" />
                    </Button>
                  </EditPosesModal>
                )}
                <Button
                  className="ml-2"
                  variant="outline"
                  onClick={() => setEditCheckIn(true)}
                >
                  <Edit className="font-extrabold" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <FieldValue
                title="Check-in Date"
                value={DateTime.fromISO(checkIn.date).toFormat("LLLL d, yyyy")}
              />
              <FieldValue title="Check-in ID" value={`#${checkIn.id}`} />
            </div>
            <div className="py-4">
              <FieldValue title="Training" value={checkIn.training || "--"} />
              <FieldValue
                title="Cheats"
                value={checkIn.cheats || "--"}
                className="py-4"
              />
              <FieldValue title="Comments" value={checkIn.comments || "--"} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <Accordion type="single" collapsible className="border-t-1 w-full">
            <AccordionItem value="dietlog" className="px-6">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Carrot className="h-5 w-5 mr-2" />
                  Diet Log {dietLog ? ` (${dietLog.phase})` : ""}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {!dietLog ? (
                  <i>No diet log found for this check-in.</i>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
                      <FieldValue
                        title="Effective Date"
                        value={dietLog.effectiveDate}
                      />
                      <FieldValue title="Phase" value={dietLog.phase || "--"} />
                      <FieldValue
                        title="Calories"
                        value={dietLog.calories?.toString() || "--"}
                      />
                      <FieldValue
                        title="Water"
                        value={dietLog.water ? `${dietLog.water}oz` : "--"}
                      />
                      <FieldValue
                        title="Protein"
                        value={dietLog.protein ? `${dietLog.protein}g` : "--"}
                      />
                      <FieldValue
                        title="Carbs"
                        value={dietLog.carbs ? `${dietLog.carbs}g` : "--"}
                      />
                      <FieldValue
                        title="Fat"
                        value={dietLog.fat ? `${dietLog.fat}g` : "--"}
                      />
                      <FieldValue
                        title="Cardio"
                        value={dietLog.cardio || "--"}
                      />
                      <FieldValue
                        title="Steps"
                        value={dietLog.steps ? `${dietLog.steps} steps` : "--"}
                      />
                    </div>
                    <div className="py-4">
                      <FieldValue title="Notes" value={dietLog.notes || "--"} />
                    </div>
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="attachments" className="px-6">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Photos ({attachments ? attachments.length : 0})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                  {!attachments || attachments.length === 0 ? (
                    <i>No photos found for this check-in.</i>
                  ) : (
                    attachments.map((attachment, index) => {
                      const isImage = attachment.s3Filename?.match(
                        /\.(jpg|jpeg|png|gif|webp)$/i
                      );

                      // Use blob data if available, otherwise fall back to URL
                      let imageUrl: string | undefined;
                      if (
                        attachment.blob?.data &&
                        attachment.blob?.contentType
                      ) {
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
                    })
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="comments" className="px-6">
              <AccordionTrigger>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Comments ({comments.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  {comments.length === 0 ? (
                    <i>No comments found for this check-in.</i>
                  ) : (
                    comments
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime()
                      )
                      .map((comment: CheckInComment, index: number) => (
                        <div
                          key={comment.id || index}
                          className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-gray-600">
                              User ID: {comment.userId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {DateTime.fromISO(comment.date).toFormat(
                                "MMM d, yyyy 'at' h:mm a"
                              )}
                            </div>
                          </div>
                          <div className="text-gray-800">{comment.comment}</div>
                        </div>
                      ))
                  )}

                  {/* Add comment input box */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            addComment();
                          }
                        }}
                      />
                      <Button
                        onClick={addComment}
                        disabled={!newComment.trim() || addCommentLoading}
                        size="sm"
                        className="px-3"
                      >
                        {addCommentLoading ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      </Card>
    </div>
  );
};

export default connector(ViewCheckIn);
