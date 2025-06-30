"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../../store/reducer";
import { deleteCheckIn } from "../../../state/actions";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { H3, Button } from "@/components/ui";
import {
  Edit,
  Calendar,
  MessageSquare,
  Utensils,
  Dumbbell,
} from "lucide-react";
import { CheckIn } from "../../../state/types";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import ConfirmDeleteCheckIn from "./ConfirmDeleteCheckIn";

function mapStateToProps(state: RootState) {
  return {
    checkIns: state.checkins.checkIns,
    editCheckInLoading: state.checkins.editCheckInLoading,
  };
}

const connector = connect(mapStateToProps, {
  deleteCheckIn,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

interface ViewCheckInProps extends PropsFromRedux {
  checkIn?: CheckIn;
  setEditCheckIn: (edit: boolean) => void;
}

const ViewCheckIn: React.FC<ViewCheckInProps> = ({
  checkIn,
  setEditCheckIn,
  editCheckInLoading,
  deleteCheckIn,
}) => {
  const params = useParams();
  const router = useRouter();

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditCheckIn(true)}
                disabled={editCheckInLoading}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <ConfirmDeleteCheckIn
                checkInId={checkIn.id!}
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
          </div>

          {/* Empty state if no content */}
          {!checkIn.training && !checkIn.cheats && !checkIn.comments && (
            <div className="text-center py-8 text-gray-500">
              <p>This check-in doesn't have any additional information.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default connector(ViewCheckIn);
