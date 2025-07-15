"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/app/store/reducer";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
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

  console.log(poseTrainingPhotos);
  console.log(poseModelData);

  // Access the photos array from the simplified structure
  const allPhotos = poseTrainingPhotos?.photos || [];
  const trainingPhotos = allPhotos.filter(photo => photo.location === 'training');
  const checkInPhotos = allPhotos.filter(photo => photo.location === 'checkin');

  return (
    <div className="w-full mb-40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:h-[600px]">
        {/* Left Column - Content */}
        <Card className="w-full rounded-sm p-0 h-full">
          <CardContent className="p-8 h-full">
            <div className="flex flex-col items-center justify-center space-y-4 h-full">
              <Upload className="h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium">Content Area</h3>
              <p className="text-sm text-gray-500 text-center">
                Content goes here
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Content */}
        <Card className="w-full rounded-sm p-0 h-full">
          <CardContent className="p-6 h-full flex flex-col items-center justify-center">
            <div className="text-gray-400 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Content Area</h3>
              <p className="text-sm">Content goes here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default connector(PoseDashboard);
