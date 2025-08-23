"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Review } from "@/app/(secure)/training/state/types";

// Review schema
const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
  review: z
    .string()
    .min(1, "Please enter a review")
    .max(1000, "Review must be less than 1000 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gymId: number;
  initialRating?: number;
  existingReview?: Review;
  onSubmit: (data: Partial<Review>) => void;
  loading?: boolean;
}

export function ReviewForm({
  open,
  onOpenChange,
  gymId,
  initialRating = 0,
  existingReview,
  onSubmit,
  loading = false,
}: ReviewFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating || initialRating,
      review: existingReview?.review || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        rating: existingReview?.rating || initialRating,
        review: existingReview?.review || "",
      });
    }
  }, [open, initialRating, existingReview, reset]);

  const handleFormSubmit = (data: ReviewFormData) => {
    onSubmit({
      gymId,
      userId: "", // This will be set by the backend/action
      rating: data.rating,
      review: data.review,
      id: existingReview?.id, // Use existing review ID for edits, undefined for new reviews
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? "Edit Review" : "Write a Review"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Controller
              name="rating"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="flex flex-col gap-2">
                  <Rating
                    value={value}
                    onValueChange={onChange}
                    className="text-white"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <RatingButton key={star} size={24} />
                    ))}
                  </Rating>
                  {value > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {value} out of 5 stars
                    </span>
                  )}
                </div>
              )}
            />
            {errors.rating && (
              <p className="text-sm text-destructive">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Review</Label>
            <Controller
              name="review"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="review"
                  placeholder="Share your experience at this gym..."
                  rows={4}
                  className="resize-none"
                />
              )}
            />
            {errors.review && (
              <p className="text-sm text-destructive">
                {errors.review.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (existingReview ? "Updating..." : "Submitting...") 
                : (existingReview ? "Update Review" : "Submit Review")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
