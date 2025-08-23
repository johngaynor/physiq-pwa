"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SectionWrapper,
  InputWrapper,
} from "@/app/(secure)/diet/new/components/FormWrappers";
import { Input, Label, Button, H3 } from "@/components/ui";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SearchBox } from "@mapbox/search-js-react";
import { ArrowLeft } from "lucide-react";
import { Gym } from "@/app/(secure)/training/state/types";
import { GymFormData, gymSchema, GymRawFormData, gymRawSchema } from "../types";
import { useTheme } from "next-themes";
import { TagSelector } from "./TagSelector";

const GymForm = ({
  latestGym,
  onSubmit,
  gym,
  setEditGym,
}: {
  latestGym?: Gym | null;
  onSubmit: (data: GymFormData) => void;
  gym?: Gym | null;
  setEditGym?: (edit: boolean) => void;
  theme?: string;
}) => {
  // form setup
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GymRawFormData>({
    resolver: zodResolver(gymRawSchema),
    defaultValues: gym
      ? {
          ...gym,
          tags: gym.tags || [],
        }
      : {
          name: "",
          streetAddress: "",
          city: "",
          state: "",
          postalCode: "",
          fullAddress: "",
          latitude: null,
          longitude: null,
          comments: "",
          tags: [],
        },
  });

  function copyFromLastGym() {
    if (!latestGym) return;

    reset({
      name: latestGym.name || "",
      streetAddress: latestGym.streetAddress || "",
      city: latestGym.city || "",
      state: latestGym.state || "",
      postalCode: latestGym.postalCode || "",
      fullAddress: latestGym.fullAddress || "",
      latitude: latestGym.latitude,
      longitude: latestGym.longitude,
      comments: latestGym.comments || "",
      tags: latestGym.tags || [],
    });
  }

  const handleRetrieve = (response: any) => {
    if (response.features?.[0]) {
      const feature = response.features[0];
      const { full_address, context, coordinates } = feature.properties || {};

      if (context) {
        setValue("streetAddress", context.address?.name || "");
        setValue("postalCode", context.postcode?.name || "");
        setValue("city", context.place?.name || "");
        setValue(
          "state",
          context.region?.region_code_full?.replace("US-", "") ||
            context.region?.region_code ||
            ""
        );
      }

      setValue("fullAddress", full_address || "");
      setValue("latitude", coordinates?.latitude || null);
      setValue("longitude", coordinates?.longitude || null);
    }
  };

  const handleFormSubmit = (rawData: GymRawFormData) => {
    try {
      const parsed = gymSchema.parse(rawData);
      onSubmit(parsed);
    } catch (err) {
      console.error("Zod parse failed", err);
    }
  };

  const SearchBoxComponent = SearchBox as any;
  const { theme } = useTheme();

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full mb-20">
      {/* General Information */}
      <SectionWrapper
        title="General Information"
        action={
          <div>
            {setEditGym && (
              <Button
                variant="outline"
                onClick={() => setEditGym(false)}
                type="button"
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            {latestGym && (
              <Button variant="outline" onClick={copyFromLastGym} type="button">
                Copy from Last Gym
              </Button>
            )}
          </div>
        }
      >
        <InputWrapper error={errors.name?.message}>
          <Label htmlFor="name">Gym Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter gym name..."
            {...register("name")}
          />
        </InputWrapper>
        <InputWrapper error={errors.comments?.message}>
          <Label htmlFor="comments">Comments</Label>
          <Input
            id="comments"
            type="text"
            placeholder="Enter any comments about this gym..."
            {...register("comments")}
          />
        </InputWrapper>
        <InputWrapper>
          <Label>Gym Tags</Label>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagSelector
                value={field.value || []}
                onChange={field.onChange}
              />
            )}
          />
        </InputWrapper>
      </SectionWrapper>

      {/* Address */}
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>
            <H3>Address</H3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <InputWrapper>
              <Label>Search for Gym Location</Label>
              <SearchBoxComponent
                accessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
                options={{
                  language: "en",
                  country: "US",
                  types: "poi",
                  proximity: "ip",
                }}
                onRetrieve={handleRetrieve}
                placeholder="Search for gym locations..."
                theme={
                  theme === "dark"
                    ? {
                        variables: {
                          colorBackground: "#0f172a",
                          colorBackgroundHover: "#1e293b",
                          colorText: "#ffffff",
                          fontFamily: "inherit",
                          unit: "14px",
                        },
                        cssText: `
                          .Input {
                            color: #ffffff !important;
                            border: 1px solid #374151 !important;
                            border-radius: 6px !important;
                            background-color: #0f172a !important;
                          }
                        `,
                      }
                    : {}
                }
              />
            </InputWrapper>

            <InputWrapper error={errors.streetAddress?.message}>
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                placeholder="Street address"
                {...register("streetAddress")}
                readOnly
              />
            </InputWrapper>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputWrapper error={errors.city?.message}>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  {...register("city")}
                  readOnly
                />
              </InputWrapper>

              <InputWrapper error={errors.state?.message}>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="State"
                  {...register("state")}
                  readOnly
                />
              </InputWrapper>

              <InputWrapper error={errors.postalCode?.message}>
                <Label htmlFor="postalCode">ZIP Code</Label>
                <Input
                  id="postalCode"
                  placeholder="ZIP"
                  {...register("postalCode")}
                  readOnly
                />
              </InputWrapper>
            </div>

            <InputWrapper error={errors.fullAddress?.message}>
              <Label htmlFor="fullAddress">Full Address</Label>
              <Input
                id="fullAddress"
                placeholder="Full address"
                {...register("fullAddress")}
                readOnly
              />
            </InputWrapper>

            <p className="text-sm text-muted-foreground italic">
              Address must come from a selection to ensure it is accurate.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" variant="outline">
        {gym ? "Update Gym" : "Create Gym"}
      </Button>
    </form>
  );
};

export default GymForm;
