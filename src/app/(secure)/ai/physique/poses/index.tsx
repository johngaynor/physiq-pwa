"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/app/store/reducer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, BarChart3, User, GitBranch } from "lucide-react";
import {
  getPoseTrainingPhotos,
  getPoseModelData,
} from "@/app/(secure)/physique/state/actions";

function mapStateToProps(state: RootState) {
  return {
    poseTrainingPhotos: state.physique.poseTrainingPhotos,
    poseTrainingPhotosLoading: state.physique.poseTrainingPhotosLoading,
    poseModelData: state.physique.poseModelData,
    poseModelDataLoading: state.physique.poseModelDataLoading,
  };
}

const connector = connect(mapStateToProps, {
  getPoseTrainingPhotos,
  getPoseModelData,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const PoseDashboard: React.FC<PropsFromRedux> = ({
  poseTrainingPhotos,
  poseTrainingPhotosLoading,
  poseModelData,
  poseModelDataLoading,
  getPoseTrainingPhotos,
  getPoseModelData,
}) => {
  React.useEffect(() => {
    if (!poseTrainingPhotos && !poseTrainingPhotosLoading)
      getPoseTrainingPhotos();
  }, [poseTrainingPhotos, poseTrainingPhotosLoading, getPoseTrainingPhotos]);

  React.useEffect(() => {
    if (!poseModelData && !poseModelDataLoading) getPoseModelData();
  }, [poseModelData, poseModelDataLoading, getPoseModelData]);

  // Calculate statistics
  const totalPhotos = poseTrainingPhotos ? poseTrainingPhotos.length : 0;
  const totalCalls = poseModelData?.totalCalls || 0;
  const userContributedPhotos =
    poseTrainingPhotos?.filter((photo) => photo.s3Filename !== null).length ||
    0;

  return (
    <div className="w-full mb-40">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Model Data Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Model</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {poseModelData?.model?.versionNum || "N/A"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {poseModelData?.model?.githubRepo || "No repo"}
            </div>
            <div className="text-xs text-muted-foreground">
              Stack: {poseModelData?.model?.stack || "Unknown"}
            </div>
          </CardContent>
        </Card>

        {/* Total Training Photos Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Training Photos
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPhotos}</div>
            <p className="text-xs text-muted-foreground">
              All photos in dataset
            </p>
          </CardContent>
        </Card>

        {/* Total Calls Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total API Calls
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              Model predictions made
            </p>
          </CardContent>
        </Card>

        {/* User Contributed Photos Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Contributions
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userContributedPhotos}</div>
            <p className="text-xs text-muted-foreground">
              Photos you've contributed
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default connector(PoseDashboard);
