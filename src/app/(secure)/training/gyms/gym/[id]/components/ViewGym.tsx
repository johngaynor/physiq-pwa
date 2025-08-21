"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../../../store/reducer";
import {
  getGyms,
  deleteGym,
  editGym,
  getGymPhotos,
  uploadGymPhotos,
  deleteGymPhoto,
} from "../../../../state/actions";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { FieldValue } from "@/app/(secure)/components/Forms/FieldValues";
import { H3, Button } from "@/components/ui";
import { Edit, Trash, Camera, Upload, Home, Share } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ConfirmDeleteModal from "@/app/(secure)/components/Modals/ConfirmDeleteModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { UploadPhoto } from "./UploadPhoto";
import { GymForm } from "../../../components/GymForm";

function mapStateToProps(state: RootState) {
  return {
    gyms: state.training.gyms,
    gymsLoading: state.training.gymsLoading,
    gymPhotos: state.training.gymPhotos,
    gymPhotosLoading: state.training.gymPhotosLoading,
    gymPhotosId: state.training.gymPhotosId,
    uploadGymPhotosLoading: state.training.uploadGymPhotosLoading,
    deleteGymPhotoLoading: state.training.deleteGymPhotoLoading,
    user: state.app.user,
  };
}

const connector = connect(mapStateToProps, {
  getGyms,
  deleteGym,
  editGym,
  getGymPhotos,
  uploadGymPhotos,
  deleteGymPhoto,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const ViewGym: React.FC<PropsFromRedux> = ({
  gyms,
  gymsLoading,
  getGyms,
  deleteGym,
  editGym,
  user,
  gymPhotos,
  gymPhotosLoading,
  gymPhotosId,
  getGymPhotos,
  uploadGymPhotos,
  uploadGymPhotosLoading,
  deleteGymPhoto,
  deleteGymPhotoLoading,
}) => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const gymId = params.id ? parseInt(params.id as string) : null;

  React.useEffect(() => {
    if (!gyms && !gymsLoading) getGyms();
    if (gymId && gymPhotosId !== gymId && !gymPhotosLoading)
      getGymPhotos(gymId);
  }, [
    gyms,
    gymsLoading,
    getGyms,
    gymId,
    gymPhotosId,
    gymPhotosLoading,
    getGymPhotos,
  ]);

  const gym = React.useMemo(() => {
    return gyms?.find((gym) => gym.id === gymId);
  }, [gyms, gymId]);

  const isAdmin = user?.apps.some((app) => app.id === 1);

  if (!gym) {
    return (
      <div className="w-full">
        <Card className="w-full rounded-sm p-0">
          <CardContent className="p-4">
            <p>
              There was no gym found with this ID. If you think this was a
              mistake, please contact your coach.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const token = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;
  const zoom = 10;
  const width = 600;
  const height = 400;

  const marker = `pin-s+ff0000(${gym.longitude},${gym.latitude})`;
  const style = "mapbox/streets-v12";
  const url = `https://api.mapbox.com/styles/v1/${style}/static/${marker}/${gym.longitude},${gym.latitude},${zoom},0/${width}x${height}@2x?access_token=${token}`;

  return (
    <TooltipProvider>
      <div className="w-full mb-20">
        <Card className="w-full rounded-sm p-0">
          <CardContent className="flex flex-col md:flex-row justify-between grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
              <div className="mb-6 flex justify-between items-center">
                <H3>{gym.name}</H3>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() =>
                          alert("This functionality is not available yet...")
                        }
                      >
                        <Home className="font-extrabold" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Set as home gym</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="ml-2"
                        variant="outline"
                        onClick={() => {
                          const destination = encodeURIComponent(
                            gym.fullAddress
                          );
                          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
                          window.open(googleMapsUrl, "_blank");
                        }}
                      >
                        <Share className="font-extrabold" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Go to maps</p>
                    </TooltipContent>
                  </Tooltip>
                  {isAdmin && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <GymForm
                          Trigger={
                            <Button className="ml-2" variant="outline">
                              <Edit className="font-extrabold" />
                            </Button>
                          }
                          title="Edit Gym"
                          description="Update information about this gym."
                          onSubmit={(values) => {
                            editGym({ ...values, id: gym.id });
                          }}
                          initialValues={{
                            name: gym.name,
                            streetAddress: gym.streetAddress,
                            city: gym.city,
                            state: gym.state,
                            postalCode: gym.postalCode,
                            fullAddress: gym.fullAddress,
                            latitude: gym.latitude,
                            longitude: gym.longitude,
                            comments: gym.comments,
                          }}
                          theme={theme}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit gym</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {isAdmin && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ConfirmDeleteModal
                          trigger={
                            <Button className="ml-2" variant="outline">
                              <Trash className="font-extrabold" />
                            </Button>
                          }
                          onConfirm={() => {
                            if (gym.id) {
                              deleteGym(gym.id);
                              router.push("/training/gyms");
                            }
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete gym</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

              <div className="py-4">
                <FieldValue title="Address" value={gym.fullAddress} />
                <div className="mt-4">
                  <FieldValue title="Comments" value={gym.comments || "N/A"} />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div>
                    <FieldValue title="Your workouts here" value="0" />
                  </div>
                  <div>
                    <FieldValue title="Total workouts here" value="0" />
                  </div>
                  <div>
                    <FieldValue title="User photos" value="0" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="rounded-xl overflow-hidden shadow-md">
                <Image
                  src={url}
                  alt={`Map showing ${name}`}
                  width={width}
                  height={height}
                  unoptimized // prevents Next.js from trying to optimize the external URL
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-0">
            <Accordion type="single" collapsible className="border-t-1 w-full">
              <AccordionItem value="photos" className="px-6">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Photos ({gymPhotos ? gymPhotos.length : 0})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {isAdmin && gymId && (
                    <div className="mb-4">
                      <UploadPhoto
                        Trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Photos
                          </Button>
                        }
                        gymId={gymId}
                        onUpload={uploadGymPhotos}
                        uploading={uploadGymPhotosLoading}
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                    {gymPhotosLoading ? (
                      <div className="col-span-full text-center py-4">
                        <i>Loading photos...</i>
                      </div>
                    ) : !gymPhotos || gymPhotos.length === 0 ? (
                      <div className="col-span-full text-center py-4">
                        <i>No photos found for this gym.</i>
                      </div>
                    ) : (
                      gymPhotos.map((photo, index) => {
                        const isImage = photo.s3Filename?.match(
                          /\.(jpg|jpeg|png|gif|webp)$/i
                        );

                        // Use blob data if available, otherwise fall back to URL
                        let imageUrl: string | undefined;
                        if (photo.blob?.data && photo.blob?.contentType) {
                          imageUrl = `data:${photo.blob.contentType};base64,${photo.blob.data}`;
                        } else {
                          imageUrl = photo.url;
                        }

                        return (
                          <div
                            key={photo.id || index}
                            className="relative group border rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="aspect-square relative">
                              {isImage && imageUrl ? (
                                // Use regular img tag for base64 data, Next.js Image for URLs
                                imageUrl.startsWith("data:") ? (
                                  <img
                                    src={imageUrl}
                                    alt={
                                      photo.s3Filename ||
                                      `Gym photo ${index + 1}`
                                    }
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                      console.error(
                                        `Image failed to load: ${photo.s3Filename}`,
                                        e
                                      );
                                      // Fallback to file icon if image fails to load
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `
                                        <div class="flex flex-col items-center justify-center h-full p-4">
                                          <div class="text-4xl mb-2">📄</div>
                                          <div class="text-sm text-center font-medium truncate w-full">
                                            ${photo.filename || "Gym Photo"}
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
                                      photo.s3Filename ||
                                      `Gym photo ${index + 1}`
                                    }
                                    fill
                                    className="object-cover rounded-lg"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    unoptimized={true}
                                    onError={(e) => {
                                      console.error(
                                        `Image failed to load: ${photo.s3Filename}`,
                                        e
                                      );
                                      // Fallback to file icon if image fails to load
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `
                                        <div class="flex flex-col items-center justify-center h-full p-4">
                                          <div class="text-4xl mb-2">📄</div>
                                          <div class="text-sm text-center font-medium truncate w-full">
                                            ${photo.filename || "Gym Photo"}
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
                                    {photo.filename || "Gym Photo"}
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* File info overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex items-center justify-between">
                                <div className="text-xs truncate">
                                  {photo.filename ||
                                    photo.s3Filename ||
                                    "Gym Photo"}
                                </div>
                                {isAdmin && photo.id && (
                                  <ConfirmDeleteModal
                                    trigger={
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-white hover:text-red-400 hover:bg-red-900/20"
                                        disabled={deleteGymPhotoLoading}
                                      >
                                        <Trash className="h-3 w-3" />
                                      </Button>
                                    }
                                    onConfirm={() => deleteGymPhoto(photo.id!)}
                                    description="Are you sure you want to delete this photo? This action cannot be undone."
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default connector(ViewGym);
