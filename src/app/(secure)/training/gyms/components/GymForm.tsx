import React from "react";
import { Input, Label } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui";
import { SearchBox } from "@mapbox/search-js-react";
import { Gym } from "@/app/(secure)/training/state/types";

type GymFormValues = Partial<Gym>;

type GymFormProps = {
  Trigger: React.ReactNode;
  title: string;
  description: string;
  onSubmit: (values: GymFormValues) => void;
  initialValues?: GymFormValues;
  theme?: string;
};

export function GymForm({
  Trigger,
  title,
  description,
  onSubmit,
  initialValues = {
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    fullAddress: "",
    latitude: null,
    longitude: null,
  },
  theme = "light",
}: GymFormProps) {
  const [formValues, setFormValues] =
    React.useState<GymFormValues>(initialValues);
  const [open, setOpen] = React.useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  function handleSubmit() {
    onSubmit(formValues);
    setOpen(false);
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    // Reset form values when dialog closes
    if (!isOpen) {
      setFormValues(initialValues);
    }
  }

  const handleRetrieve = (response: any) => {
    if (response.features?.[0]) {
      const feature = response.features[0];

      const { full_address, context, coordinates } = feature.properties || {};
      const fields = {
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        fullAddress: full_address || "",
        latitude: coordinates?.latitude || null,
        longitude: coordinates?.longitude || null,
      };

      if (context) {
        fields.streetAddress = context.address?.name || "";
        fields.postalCode = context.postcode?.name || "";
        fields.city = context.place?.name || "";
        fields.state =
          context.region?.region_code_full?.replace("US-", "") ||
          context.region?.region_code ||
          "";
      }
      setFormValues((prev) => ({
        ...prev,
        ...fields,
      }));
    }
  };

  const SearchBoxComponent = SearchBox as any;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] top-[20%] translate-y-0 max-h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Gym Name
            </Label>
            <Input
              id="name"
              value={formValues.name}
              onChange={handleChange}
              className="col-span-3"
              type="text"
              placeholder="Enter gym name..."
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="mapbox-address" className="text-right pt-2">
            Gym Address
          </Label>
          {/* address section */}
          <div className="col-span-3">
            <div className="mb-4">
              <SearchBoxComponent
                accessToken="pk.eyJ1Ijoiam9obmdheW5vcmRldiIsImEiOiJjbWVoaWUxYnUwMTJuMmxwdTN4bGpycjF2In0.M5om4EzqkW7cml6tQiQXRg"
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
            </div>
            <div className="space-y-2">
              <Input
                name="address-1"
                autoComplete="address-line1"
                placeholder="Street address"
                value={formValues.streetAddress}
                readOnly
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  name="city"
                  autoComplete="address-level2"
                  placeholder="City"
                  value={formValues.city}
                  readOnly
                />
                <Input
                  name="state"
                  autoComplete="address-level1"
                  placeholder="State"
                  value={formValues.state}
                  readOnly
                />
                <Input
                  name="zip"
                  autoComplete="postal-code"
                  placeholder="ZIP"
                  value={formValues.postalCode}
                  readOnly
                />
              </div>
              <p className="text-sm text-gray-600 italic mt-2">
                Address must come from a selection to ensure it is accurate.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => setFormValues(initialValues)}
            disabled={
              !formValues.name?.trim() && !formValues.fullAddress?.trim()
            }
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={
              !formValues.name?.trim() || !formValues.fullAddress?.trim()
            }
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
