"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SectionWrapper, InputWrapper } from "./FormWrappers";
import { Input, Label, Button, H3 } from "@/components/ui";
import Link from "next/link";
import { Info } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  onSubmit: (data: CheckInFormData) => void;
  checkIn?: CheckIn | null;
  setEditCheckIn?: (edit: boolean) => void;
  dietLogs: DietLog[];
}) => {
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
          attachments: checkIn.attachments || [],
        }
      : {
          attachments: [],
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
      console.log("CheckIn form submission:", parsed);
      onSubmit(parsed);
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
        <SectionWrapper
          title="Diet Log Information"
          action={
            <Link href={`/diet/log/${applicableDietLog.id}`}>
              <Button variant="outline" size="sm" type="button">
                <Info className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          }
        >
          <InputWrapper>
            <Label htmlFor="dietLog-effectiveDate">Effective Date</Label>
            <Input
              id="dietLog-effectiveDate"
              value={applicableDietLog.effectiveDate}
              disabled
              className="bg-gray-50"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="dietLog-phase">Phase</Label>
            <Input
              id="dietLog-phase"
              value={applicableDietLog.phase || "Not specified"}
              disabled
              className="bg-gray-50"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="dietLog-calories">Calories</Label>
            <Input
              id="dietLog-calories"
              value={applicableDietLog.calories || "Not calculated"}
              disabled
              className="bg-gray-50"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="dietLog-protein">Protein (g)</Label>
            <Input
              id="dietLog-protein"
              value={applicableDietLog.protein}
              disabled
              className="bg-gray-50"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="dietLog-carbs">Carbs (g)</Label>
            <Input
              id="dietLog-carbs"
              value={applicableDietLog.carbs}
              disabled
              className="bg-gray-50"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="dietLog-fat">Fat (g)</Label>
            <Input
              id="dietLog-fat"
              value={applicableDietLog.fat}
              disabled
              className="bg-gray-50"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="dietLog-water">Water (oz)</Label>
            <Input
              id="dietLog-water"
              value={applicableDietLog.water}
              disabled
              className="bg-gray-50"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="dietLog-steps">Steps</Label>
            <Input
              id="dietLog-steps"
              value={applicableDietLog.steps}
              disabled
              className="bg-gray-50"
            />
          </InputWrapper>
        </SectionWrapper>
      )}

      <Button type="submit" variant="outline">
        Submit Check-In
      </Button>
    </form>
  );
};

export default CheckInForm;
