"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SectionWrapper, InputWrapper } from "./FormWrappers";
import { Input, Label, Button } from "@/components/ui";
import Link from "next/link";
import { Info } from "lucide-react";
import { CheckIn } from "../../state/types";
import { DietLog } from "../../../diet/state/types";
import {
  CheckInFormData,
  checkInSchema,
  CheckInRawFormData,
  checkInRawSchema,
} from "../types";
import { DateTime } from "luxon";

const CheckInForm = ({
  onSubmit,
  checkIn,
  setEditCheckIn,
  dietLogs,
}: {
  onSubmit: (data: CheckInFormData, files?: File[]) => void;
  checkIn?: CheckIn | null;
  setEditCheckIn?: (edit: boolean) => void;
  dietLogs: DietLog[];
}) => {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  // form setup
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckInRawFormData>({
    resolver: zodResolver(checkInRawSchema),
    defaultValues: checkIn
      ? {
          ...checkIn,
        }
      : {
          date: DateTime.now().toISODate(),
        },
  });

  // Watch the date field to dynamically determine applicable diet log
  const watchedDate = watch("date");

  const applicableDietLog = React.useMemo(() => {
    if (!watchedDate || !dietLogs.length) return null;

    // Find the diet log that matches the check-in date or is closest before it
    const sortedDietLogs = dietLogs
      .slice()
      .sort(
        (a, b) =>
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime()
      );

    // First try to find exact match
    const exactMatch = sortedDietLogs.find(
      (log) => log.effectiveDate === watchedDate
    );
    if (exactMatch) return exactMatch;

    // If no exact match, find the most recent log before the check-in date
    const checkInDate = new Date(watchedDate);
    const previousLog = sortedDietLogs.find(
      (log) => new Date(log.effectiveDate) <= checkInDate
    );

    return previousLog || null;
  }, [watchedDate, dietLogs]);

  const handleFormSubmit = (rawData: CheckInRawFormData) => {
    try {
      const parsed = checkInSchema.parse(rawData);
      onSubmit(parsed, selectedFiles);
    } catch (err) {
      console.error("Zod parse failed", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full mb-20">
      {/* General */}
      <SectionWrapper
        title="General"
        action={
          setEditCheckIn && (
            <Button
              variant="outline"
              onClick={() => setEditCheckIn(false)}
              type="button"
            >
              Cancel
            </Button>
          )
        }
      >
        <InputWrapper error={errors.date?.message}>
          <Label htmlFor="date">Date (YYYY-MM-DD)</Label>
          <Input
            id="date"
            type="text"
            placeholder="Enter date..."
            {...register("date")}
          />
        </InputWrapper>
        <InputWrapper error={errors.comments?.message}>
          <Label htmlFor="comments">Comments</Label>
          <Input
            id="comments"
            type="text"
            placeholder="Enter comments..."
            {...register("comments")}
          />
        </InputWrapper>
        <InputWrapper error={errors.cheats?.message}>
          <Label htmlFor="cheats">Cheats</Label>
          <Input
            id="cheats"
            type="text"
            placeholder="Enter cheat meals/days..."
            {...register("cheats")}
          />
        </InputWrapper>
        <InputWrapper error={errors.training?.message}>
          <Label htmlFor="training">Training</Label>
          <Input
            id="training"
            type="text"
            placeholder="Enter training information..."
            {...register("training")}
          />
        </InputWrapper>
      </SectionWrapper>
      {/* Applicable Diet Log Info */}
      {applicableDietLog && (
        <></>
        // <SectionWrapper
        //   title="Diet Log Information"
        //   action={
        //     <Link href={`/diet/log/${applicableDietLog.id}`}>
        //       <Button variant="outline" size="sm" type="button">
        //         <Info className="h-4 w-4 mr-2" />
        //         View Details
        //       </Button>
        //     </Link>
        //   }
        // >
        //   <InputWrapper>
        //     <Label htmlFor="dietLog-effectiveDate">Effective Date</Label>
        //     <Input
        //       id="dietLog-effectiveDate"
        //       value={applicableDietLog.effectiveDate}
        //       disabled
        //       className="bg-gray-50"
        //     />
        //   </InputWrapper>
        //   <InputWrapper>
        //     <Label htmlFor="dietLog-phase">Phase</Label>
        //     <Input
        //       id="dietLog-phase"
        //       value={applicableDietLog.phase || "Not specified"}
        //       disabled
        //       className="bg-gray-50"
        //     />
        //   </InputWrapper>
        //   <InputWrapper>
        //     <Label htmlFor="dietLog-calories">Calories</Label>
        //     <Input
        //       id="dietLog-calories"
        //       value={applicableDietLog.calories || "Not calculated"}
        //       disabled
        //       className="bg-gray-50"
        //     />
        //   </InputWrapper>
        //   <InputWrapper>
        //     <Label htmlFor="dietLog-protein">Protein (g)</Label>
        //     <Input
        //       id="dietLog-protein"
        //       value={applicableDietLog.protein}
        //       disabled
        //       className="bg-gray-50"
        //     />
        //   </InputWrapper>
        //   <InputWrapper>
        //     <Label htmlFor="dietLog-carbs">Carbs (g)</Label>
        //     <Input
        //       id="dietLog-carbs"
        //       value={applicableDietLog.carbs}
        //       disabled
        //       className="bg-gray-50"
        //     />
        //   </InputWrapper>
        //   <InputWrapper>
        //     <Label htmlFor="dietLog-fat">Fat (g)</Label>
        //     <Input
        //       id="dietLog-fat"
        //       value={applicableDietLog.fat}
        //       disabled
        //       className="bg-gray-50"
        //     />
        //   </InputWrapper>
        //   <InputWrapper>
        //     <Label htmlFor="dietLog-water">Water (oz)</Label>
        //     <Input
        //       id="dietLog-water"
        //       value={applicableDietLog.water}
        //       disabled
        //       className="bg-gray-50"
        //     />
        //   </InputWrapper>
        //   <InputWrapper>
        //     <Label htmlFor="dietLog-steps">Steps</Label>
        //     <Input
        //       id="dietLog-steps"
        //       value={applicableDietLog.steps}
        //       disabled
        //       className="bg-gray-50"
        //     />
        //   </InputWrapper>
        // </SectionWrapper>
      )}
      {/* Attachments Upload */}
      <SectionWrapper title="Attachments">
        <InputWrapper>
          <Label htmlFor="attachments">Upload Files</Label>
          <Controller
            name="attachments"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                id="attachments"
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setSelectedFiles(files);
                  // For now, we'll just store the file names
                  // In a real implementation, you'd upload to S3 and get the filenames
                  const attachments = files.map((file) => ({
                    s3Filename: file.name, // This would be the S3 key after upload
                  }));
                  onChange(attachments);
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            )}
          />
          {errors.attachments && (
            <p className="text-sm text-red-600 mt-1">
              {errors.attachments.message}
            </p>
          )}
        </InputWrapper>

        {/* Display selected files */}
        {watch("attachments") && watch("attachments")!.length > 0 && (
          <div className="mt-6">
            <div className="grid grid-cols-3 gap-4">
              {watch("attachments")?.map((attachment, index) => {
                const file = selectedFiles[index];
                const isImage = file?.type.startsWith("image/");

                return (
                  <div
                    key={index}
                    className="w-32 h-32 border rounded-lg p-2 bg-gray-50 relative group hover:bg-gray-100 transition-colors"
                  >
                    {/* Image Preview */}
                    {isImage && file && (
                      <div className="w-full h-full mb-1">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover rounded border"
                        />
                      </div>
                    )}

                    {/* Non-image file icon/placeholder */}
                    {!isImage && file && (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 mb-1">
                        <div className="text-4xl mb-2">📄</div>
                        <div className="text-sm text-center font-medium truncate w-full px-1">
                          {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                        </div>
                      </div>
                    )}

                    {/* File Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-sm truncate">
                        {attachment.s3Filename}
                      </div>
                      {file && (
                        <div className="text-xs opacity-75">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentAttachments = watch("attachments") || [];
                        const newAttachments = currentAttachments.filter(
                          (_, i) => i !== index
                        );
                        const newFiles = selectedFiles.filter(
                          (_, i) => i !== index
                        );
                        setSelectedFiles(newFiles);
                        reset({
                          ...watch(),
                          attachments: newAttachments,
                        });
                      }}
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white border-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </SectionWrapper>
      <Button type="submit" variant="outline">
        Submit Check-In
      </Button>
    </form>
  );
};

export default CheckInForm;
