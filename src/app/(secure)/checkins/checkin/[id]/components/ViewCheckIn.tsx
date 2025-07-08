"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../../store/reducer";
import { deleteCheckIn } from "../../../state/actions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { H3, Button } from "@/components/ui";
import {
  Edit,
  Calendar,
  MessageSquare,
  Utensils,
  Dumbbell,
  Camera,
  Edit3,
  ChevronDown,
  Trash,
} from "lucide-react";
import { CheckIn, CheckInAttachment } from "../../../state/types";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FieldValue } from "./FieldValue";

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
  checkIns,
}) => {
  const router = useRouter();

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

    const start = checkIn.date;
    const end = lastCheckIn ? lastCheckIn.date : null;

    return dailyLogs.filter((dl) => {
      const date = dl.date;
      return end ? date >= start && date < end : date >= start;
    });
  }, [dailyLogs, checkIn, lastCheckIn]);

  console.log(filteredDailyLogs);

  // Helper function to prepare weight data for chart
  const getWeightData = () => {
    if (!dailyLogs || !checkIn) return [];

    const checkInDate = DateTime.fromISO(checkIn.date);
    const thirtyDaysAgo = checkInDate.minus({ days: 30 });

    const weightData = dailyLogs
      .filter((log) => {
        const logDate = DateTime.fromISO(log.date);
        return logDate >= thirtyDaysAgo && logDate <= checkInDate && log.weight;
      })
      .map((log) => ({
        date: DateTime.fromISO(log.date).toFormat("MMM dd"),
        weight: log.weight,
        fullDate: log.date,
      }))
      .sort((a, b) => a.fullDate.localeCompare(b.fullDate));

    return weightData;
  };

  const weightData = getWeightData();

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
            {weightData.length > 0 ? (
              <div className="h-80">
                <h4 className="text-lg font-semibold mb-4">
                  Weight Progress (Last 30 Days)
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      domain={["dataMin - 2", "dataMax + 2"]}
                    />
                    <Tooltip
                      labelFormatter={(label) => `Date: ${label}`}
                      formatter={(value: any) => [value, "Weight (lbs)"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  No weight data available for the last 30 days
                </p>
              </div>
            )}
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
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </Html2CanvasModal>
                {attachments && attachments.length > 0 && (
                  <EditPosesModal attachments={attachments}>
                    <Button className="ml-2" variant="outline" size="sm">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Poses
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
            {(checkIn.training || checkIn.cheats || checkIn.comments) && (
              <div className="py-4">
                {checkIn.training && (
                  <FieldValue title="Training" value={checkIn.training} />
                )}
                {checkIn.cheats && (
                  <FieldValue title="Cheats" value={checkIn.cheats} />
                )}
                {checkIn.comments && (
                  <FieldValue title="Comments" value={checkIn.comments} />
                )}
              </div>
            )}
            {/* Health Stats Summary */}
            {(healthStats.weight.day7Avg ||
              healthStats.weight.day30Avg ||
              healthStats.calories.day7Avg ||
              healthStats.steps.day7Avg) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {healthStats.weight.day7Avg && (
                  <FieldValue
                    title="Avg Weight (7 days)"
                    value={`${healthStats.weight.day7Avg.toFixed(1)} lbs`}
                  />
                )}
                {healthStats.weight.day30Avg && (
                  <FieldValue
                    title="Avg Weight (30 days)"
                    value={`${healthStats.weight.day30Avg.toFixed(1)} lbs`}
                  />
                )}
                {healthStats.calories.day7Avg && (
                  <FieldValue
                    title="Avg Calories (7 days)"
                    value={`${Math.round(healthStats.calories.day7Avg)} cal`}
                  />
                )}
                {healthStats.steps.day7Avg && (
                  <FieldValue
                    title="Avg Steps (7 days)"
                    value={`${Math.round(healthStats.steps.day7Avg)} steps`}
                  />
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <Accordion type="single" collapsible className="border-t-1 w-full">
            {attachments && attachments.length > 0 && (
              <AccordionItem value="attachments" className="px-6">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-purple-600" />
                    Attachments ({attachments.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                    {attachments.map((attachment, index) => {
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
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardFooter>
      </Card>
    </div>
  );
};

export default connector(ViewCheckIn);
