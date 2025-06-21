"use client";
import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SectionWrapper, InputWrapper } from "./FormWrappers";
import { Input, Label, Button, H3 } from "@/components/ui";
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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import { DietLogSupplement } from "../../state/types";
import { Supplement } from "@/app/(secure)/health/state/types";
import { dietLogSchema, DietLogFormData } from "../types";

const DietLogForm = ({
  latestLog,
  supplements,
  onSubmit,
}: {
  latestLog?: any;
  supplements?: Supplement[];
  onSubmit: (data: DietLogFormData) => void;
}) => {
  // form setup
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DietLogFormData>({
    resolver: zodResolver(dietLogSchema),
    defaultValues: { supplements: [] },
  });
  // field array for supplements
  const { fields, append, remove } = useFieldArray({
    control,
    name: "supplements",
  });

  function copyFromLastLog() {
    if (!latestLog) return;

    reset({
      protein: latestLog.protein?.toString() || "",
      fat: latestLog.fat?.toString() || "",
      carbs: latestLog.carbs?.toString() || "",
      water: latestLog.water?.toString() || "",
      effectiveDate: latestLog.effectiveDate || "",
      notes: latestLog.notes || "",
      phase: latestLog.phase || "",
      cardioMinutes: latestLog.cardioMinutes?.toString() || "",
      cardio: latestLog.cardio || "",
      steps: latestLog.steps?.toString() || "",
      supplements: (latestLog?.supplements as DietLogSupplement[]) || [],
    });
  }

  const { protein, carbs, fat, supplements: selectedSupplements } = watch();
  const calories =
    (parseFloat(protein) || 0) * 4 +
    (parseFloat(carbs) || 0) * 4 +
    (parseFloat(fat) || 0) * 9;
  const supplementOptions = supplements?.filter(
    (s) => !selectedSupplements.some((sel) => sel.supplementId === s.id)
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mb-20">
      {/* General */}
      <SectionWrapper
        title="General"
        action={
          <Button variant="outline" onClick={copyFromLastLog} type="button">
            Copy from Last Log
          </Button>
        }
      >
        <InputWrapper error={errors.effectiveDate?.message}>
          <Label htmlFor="effectiveDate">Effective Date (YYYY-MM-DD)</Label>
          <Input
            id="effectiveDate"
            type="text"
            placeholder="Enter date..."
            {...register("effectiveDate")}
          />
        </InputWrapper>
        <InputWrapper error={errors.notes?.message}>
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            type="text"
            placeholder="Enter notes..."
            {...register("notes")}
          />
        </InputWrapper>
        <InputWrapper error={errors.phase?.message}>
          <Label htmlFor="phase">Phase</Label>
          <Controller
            control={control}
            name="phase"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Phase..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Phases</SelectLabel>
                    <SelectItem value="Bulk">Bulk</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Cut">Cut</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </InputWrapper>
      </SectionWrapper>
      {/* Nutrition */}
      <SectionWrapper title="Nutrition">
        <InputWrapper error={errors.protein?.message}>
          <Label htmlFor="protein">Protein (g)</Label>
          <Input
            id="protein"
            type="number"
            placeholder="Enter protein grams..."
            {...register("protein")}
            step="0.1"
          />
        </InputWrapper>
        <InputWrapper error={errors.carbs?.message}>
          <Label htmlFor="carbs">Carbs (g)</Label>
          <Input
            id="carbs"
            type="number"
            placeholder="Enter carbs grams..."
            {...register("carbs")}
            step="0.1"
          />
        </InputWrapper>
        <InputWrapper error={errors.fat?.message}>
          <Label htmlFor="fat">Fat (g)</Label>
          <Input
            id="fat"
            type="number"
            placeholder="Enter fat grams..."
            {...register("fat")}
            step="0.1"
          />
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor="fat">Calories (kcal)</Label>
          <Input id="calories" value={calories} disabled />
        </InputWrapper>
        <InputWrapper error={errors.water?.message}>
          <Label htmlFor="water">Water (oz)</Label>
          <Input
            id="water"
            type="number"
            placeholder="Enter water oz..."
            {...register("water")}
          />
        </InputWrapper>
      </SectionWrapper>
      {/* Cardio */}
      <SectionWrapper title="Cardio">
        <InputWrapper error={errors.cardio?.message}>
          <Label htmlFor="cardio">Cardio (type)</Label>
          <Input
            id="cardio"
            type="text"
            placeholder="Enter cardio description..."
            {...register("cardio")}
          />
        </InputWrapper>
        <InputWrapper error={errors.cardioMinutes?.message}>
          <Label htmlFor="cardioMinutes">Cardio (min / week)</Label>
          <Input
            id="cardioMinutes"
            type="number"
            placeholder="Enter minutes of cardio..."
            {...register("cardioMinutes")}
          />
        </InputWrapper>
        <InputWrapper error={errors.steps?.message}>
          <Label htmlFor="steps">Steps</Label>
          <Input
            id="steps"
            type="number"
            placeholder="Enter steps..."
            {...register("steps")}
          />
        </InputWrapper>
      </SectionWrapper>
      <Card className="w-full dark:bg-[#060B1C] mb-4">
        <CardHeader className="flex w-full flex-row justify-between">
          <CardTitle>
            <H3>Supplements</H3>
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => {
              remove();
            }}
          >
            Clear All
          </Button>
        </CardHeader>
        <CardContent>
          <InputWrapper>
            <Label htmlFor="phase">Add Supplements</Label>
            <Select
              onValueChange={(value) => {
                const supp = supplements?.find(
                  (s) => s.id.toString() === value
                );
                if (supp) {
                  append({
                    supplementId: supp.id,
                    dosage: "",
                    frequency: "",
                  });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Supplement..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Supplements</SelectLabel>
                  {supplementOptions?.map((supplement) => (
                    <SelectItem
                      key={supplement.id}
                      value={supplement.id.toString()}
                    >
                      {supplement.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </InputWrapper>
          {selectedSupplements.length ? (
            <Table className="mt-8">
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Supplement</TableHead>
                  <TableHead className="lg:pl-5">Dosage</TableHead>
                  <TableHead className="hidden lg:table-cell truncate overflow-hidden">
                    Frequency
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                    <TableCell>
                      {
                        supplements?.find(
                          (s) =>
                            s.id === watch(`supplements.${index}.supplementId`)
                        )?.name
                      }
                    </TableCell>
                    <TableCell>
                      <Input
                        {...register(`supplements.${index}.dosage`)}
                        placeholder="Dosage..."
                      />
                      {errors.supplements?.[index]?.dosage?.message && (
                        <p className="text-red-500 text-sm">
                          {errors.supplements[index]?.dosage?.message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        {...register(`supplements.${index}.frequency`)}
                        placeholder="Frequency..."
                      />
                      {errors.supplements?.[index]?.frequency?.message && (
                        <p className="text-red-500 text-sm">
                          {errors.supplements[index]?.frequency?.message}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
      <Button type="submit" variant="outline">
        Submit
      </Button>
    </form>
  );
};

export default DietLogForm;
