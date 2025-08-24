"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { RootState } from "@/app/store/reducer";
import { FieldValue } from "@/app/(secure)/components/Forms/FieldValues";
import { H3, Button } from "@/components/ui";
import {
  Edit,
  Trash,
  Camera,
  Upload,
  Home,
  Share,
  MoreVertical,
  List,
  Star,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { ReviewForm } from "./ReviewForm";
import { Review } from "@/app/(secure)/training/state/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConfirmDeleteModal from "@/app/(secure)/components/Modals/ConfirmDeleteModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { UploadPhoto } from "./UploadPhoto";
import {
  getGymPhotos,
  deleteGym,
  uploadGymPhotos,
  deleteGymPhoto,
  editGymReview,
} from "@/app/(secure)/training/state/actions";

function mapStateToProps(state: RootState) {
  return {
    gyms: state.training.gyms,
    gymPhotos: state.training.gymPhotos,
    gymPhotosLoading: state.training.gymPhotosLoading,
    gymPhotosId: state.training.gymPhotosId,
    uploadGymPhotosLoading: state.training.uploadGymPhotosLoading,
    deleteGymPhotoLoading: state.training.deleteGymPhotoLoading,
    editGymReviewLoading: state.training.editGymReviewLoading,
    user: state.app.user,
  };
}

const connector = connect(mapStateToProps, {
  getGymPhotos,
  deleteGym,
  uploadGymPhotos,
  deleteGymPhoto,
  editGymReview,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const ViewGym: React.FC<
  PropsFromRedux & { setEditGym: (edit: boolean) => void }
> = ({
  gyms,
  gymPhotos,
  gymPhotosLoading,
  gymPhotosId,
  getGymPhotos,
  setEditGym,
  uploadGymPhotosLoading,
  deleteGymPhotoLoading,
  editGymReviewLoading,
  user,
  uploadGymPhotos,
  deleteGymPhoto,
  deleteGym,
  editGymReview,
}) => {
  const params = useParams();
  const router = useRouter();
  const [reviewFormOpen, setReviewFormOpen] = React.useState(false);
  const [selectedRating, setSelectedRating] = React.useState(0);
  const [editingReview, setEditingReview] = React.useState<Review | null>(null);

  const gymId = params.id ? parseInt(params.id as string) : null;

  const gym = React.useMemo(() => {
    return gyms?.find((g) => g.id === gymId);
  }, [gyms, gymId]);

  console.log(gym);

  React.useEffect(() => {
    if (gymId && gymId !== gymPhotosId && !gymPhotosLoading) {
      getGymPhotos(gymId);
    }
  }, [gymId, gymPhotosId, gymPhotosLoading, getGymPhotos]);

  const handleRatingClick = (rating: number) => {
    if (userReview) {
      // If user has existing review, edit it
      setEditingReview(userReview);
    } else {
      // If no existing review, create new one with selected rating
      setSelectedRating(rating);
      setEditingReview(null);
    }
    setReviewFormOpen(true);
  };

  // Calculate average rating
  const averageRating = React.useMemo(() => {
    if (!gym?.reviews || gym.reviews.length === 0) return 0;
    const sum = gym.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / gym.reviews.length;
  }, [gym?.reviews]);

  // Get user's existing review
  const userReview = React.useMemo(() => {
    if (!gym?.reviews || !user?.id) return null;
    return gym.reviews.find((review) => review.userId === user.id);
  }, [gym?.reviews, user?.id]);

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

  const handleReviewSubmit = (reviewData: Partial<Review>) => {
    editGymReview({
      id: reviewData.id || null,
      gymId: gym.id,
      rating: reviewData.rating!,
      review: reviewData.review!,
    });
    setReviewFormOpen(false);
    setSelectedRating(0);
    setEditingReview(null);
  };

  const token = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;
  const zoom = 10;
  const width = 600;
  const height = 400;

  const marker = `pin-s+ff0000(${gym.longitude},${gym.latitude})`;
  const style = "mapbox/streets-v12";
  const url = `https://api.mapbox.com/styles/v1/${style}/static/${marker}/${gym.longitude},${gym.latitude},${zoom},0/${width}x${height}@2x?access_token=${token}`;

  const isAdmin =
    user &&
    (user.id === gym?.createdBy || user.apps.some((app) => app.id === 1));

  return (
    <TooltipProvider>
      <div className="w-full">
        <Card className="w-full rounded-sm p-0">
          <CardContent className="flex flex-col md:flex-row justify-between grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
              <div className="mb-6 flex justify-between items-center">
                <H3>{gym.name}</H3>
                {/* Desktop buttons - show on md and larger screens */}
                <div className="hidden md:flex">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/training/gyms")}
                      >
                        <List className="font-extrabold" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Go to all gyms</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="ml-2"
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
                        <Button
                          className="ml-2"
                          variant="outline"
                          onClick={() => setEditGym(true)}
                        >
                          <Edit className="font-extrabold" />
                        </Button>
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

                {/* Mobile popover - show on smaller screens */}
                <div className="md:hidden">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <MoreVertical className="h-4 w-4 mr-2" />
                        Actions
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48" align="end">
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={() => router.push("/training/gyms")}
                        >
                          <List className="h-4 w-4 mr-2" />
                          Go to all gyms
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={() =>
                            alert("This functionality is not available yet...")
                          }
                        >
                          <Home className="h-4 w-4 mr-2" />
                          Set as home gym
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={() => {
                            const destination = encodeURIComponent(
                              gym.fullAddress
                            );
                            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
                            window.open(googleMapsUrl, "_blank");
                          }}
                        >
                          <Share className="h-4 w-4 mr-2" />
                          Go to maps
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            className="justify-start w-full"
                            onClick={() => setEditGym(true)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit gym
                          </Button>
                        )}
                        {isAdmin && (
                          <ConfirmDeleteModal
                            trigger={
                              <Button
                                variant="ghost"
                                className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete gym
                              </Button>
                            }
                            onConfirm={() => {
                              if (gym.id) {
                                deleteGym(gym.id);
                                router.push("/training/gyms");
                              }
                            }}
                          />
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="py-4">
                <FieldValue title="Address" value={gym.fullAddress} />
                <div className="mt-4">
                  <FieldValue title="Comments" value={gym.comments || "N/A"} />
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-muted-foreground mb-2">Cost (monthly)</p>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      {gym.cost === 1 && "$ ($1-49)"}
                      {gym.cost === 2 && "$$ ($50-99)"}
                      {gym.cost === 3 && "$$$ ($100+)"}
                    </Badge>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-muted-foreground mb-2">Day Passes</p>
                    <Badge
                      variant="secondary"
                      className={
                        gym.dayPasses === 1
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : gym.dayPasses === 0
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }
                    >
                      {gym.dayPasses === 1
                        ? "Yes"
                        : gym.dayPasses === 0
                        ? "No"
                        : "Uncertain"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">Average rating</p>
                    <Rating
                      value={averageRating || 0}
                      readOnly
                      className="text-muted-foreground"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <RatingButton key={star} size={20} />
                      ))}
                    </Rating>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {gym.tags.length ? (
                        gym.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <p>N/A</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">Rate this gym</p>
                    <div className="mb-3">
                      <Rating
                        value={userReview ? userReview.rating : selectedRating}
                        onValueChange={handleRatingClick}
                        className="text-muted-foreground"
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <RatingButton key={star} size={20} />
                        ))}
                      </Rating>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="rounded-xl overflow-hidden shadow-md">
                <Image
                  src={url}
                  alt={`Map showing ${gym.name}`}
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
                  {isAdmin && gym.id && (
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
                        gymId={gym.id}
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

              {/* Reviews Accordion */}
              <AccordionItem value="reviews" className="px-6">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Reviews ({gym.reviews?.length || 0})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    {!gym.reviews || gym.reviews.length === 0 ? (
                      <div className="text-center py-4">
                        <i>No reviews yet. Be the first to review this gym!</i>
                      </div>
                    ) : (
                      gym.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-4 last:border-b-0"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Rating
                              value={review.rating}
                              readOnly
                              className="text-white"
                            >
                              {[1, 2, 3, 4, 5].map((star) => (
                                <RatingButton key={star} size={14} />
                              ))}
                            </Rating>
                            <span className="text-sm text-muted-foreground">
                              {new Date(
                                review.lastUpdated
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{review.review}</p>
                        </div>
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardFooter>
        </Card>

        {/* Review Form Modal */}
        <ReviewForm
          open={reviewFormOpen}
          onOpenChange={setReviewFormOpen}
          gymId={gym.id || 0}
          initialRating={selectedRating}
          existingReview={editingReview || undefined}
          onSubmit={handleReviewSubmit}
          loading={editGymReviewLoading}
        />
      </div>
    </TooltipProvider>
  );
};

export default connector(ViewGym);
