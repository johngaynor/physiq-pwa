"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getGyms } from "../state/actions";
import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import GymMap from "./components/GymMap";
import GymList from "./components/GymList";
import GymFilters from "./components/GymFilters";
import { Filters, initialFilters } from "./types";
import LocationSearchBox from "./components/LocationSearchBox";

function mapStateToProps(state: RootState) {
  return {
    gyms: state.training.gyms,
    gymsLoading: state.training.gymsLoading,
  };
}

// Haversine formula to calculate distance between two coordinates
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

const connector = connect(mapStateToProps, {
  getGyms,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Gyms: React.FC<PropsFromRedux> = ({ gyms, gymsLoading, getGyms }) => {
  const router = useRouter();
  const [viewMode, setViewMode] = React.useState<"map" | "list">("map");
  const [filters, setFilters] = React.useState<Filters>(initialFilters);
  const [locationType, setLocationType] = React.useState<
    "" | "my-location" | "custom"
  >("");
  const [advancedOpen, setAdvancedOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!gyms && !gymsLoading) getGyms();
  }, [gyms, gymsLoading, getGyms]);

  // Function to handle getting user's location on demand
  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFilters({
            ...filters,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationType("my-location");
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your location. Please check your browser settings and try again."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Filter and sort gyms based on search, filters, and sorting
  const filteredGyms = React.useMemo(() => {
    if (!gyms) return [];

    let filtered = gyms.filter((gym) => {
      // Text search filter
      const matchesSearch =
        !filters.search.trim() ||
        gym.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        gym.fullAddress.toLowerCase().includes(filters.search.toLowerCase());

      // Cost filter
      const matchesCost = filters.cost.includes(gym.cost);

      // Day passes filter
      const matchesDayPasses = filters.dayPasses.includes(gym.dayPasses);

      // Tags filter
      const matchesTags =
        filters.tags.length === 0 ||
        filters.tags.every((tag) => gym.tags?.includes(tag));

      // Distance filter (only apply if user has set their location)
      const matchesDistance = (() => {
        if (filters.latitude === null || filters.longitude === null) {
          // If no user location is set, don't filter by distance
          return true;
        }

        if (gym.latitude === null || gym.longitude === null) {
          // If gym doesn't have coordinates, exclude it from distance filtering
          return false;
        }

        const distance = getDistanceFromLatLonInKm(
          filters.latitude,
          filters.longitude,
          gym.latitude,
          gym.longitude
        );

        // Convert kilometers to miles for comparison (1 km = 0.621371 miles)
        const distanceInMiles = distance * 0.621371;

        return distanceInMiles <= filters.distance;
      })();

      return (
        matchesSearch &&
        matchesCost &&
        matchesDayPasses &&
        matchesTags &&
        matchesDistance
      );
    });

    // Apply sorting
    if (filters.sortMethod === "costAsc") {
      filtered = filtered.sort((a, b) => a.cost - b.cost);
    } else if (filters.sortMethod === "costDesc") {
      filtered = filtered.sort((a, b) => b.cost - a.cost);
    } else if (filters.sortMethod === "ratingAsc") {
      filtered = filtered.sort((a, b) => {
        const aRating =
          a.reviews && a.reviews.length > 0
            ? a.reviews.reduce((sum, review) => sum + review.rating, 0) /
              a.reviews.length
            : 0;
        const bRating =
          b.reviews && b.reviews.length > 0
            ? b.reviews.reduce((sum, review) => sum + review.rating, 0) /
              b.reviews.length
            : 0;
        return aRating - bRating; // Sort lowest rating first
      });
    } else if (filters.sortMethod === "ratingDesc") {
      filtered = filtered.sort((a, b) => {
        const aRating =
          a.reviews && a.reviews.length > 0
            ? a.reviews.reduce((sum, review) => sum + review.rating, 0) /
              a.reviews.length
            : 0;
        const bRating =
          b.reviews && b.reviews.length > 0
            ? b.reviews.reduce((sum, review) => sum + review.rating, 0) /
              b.reviews.length
            : 0;
        return bRating - aRating; // Sort highest rating first
      });
    }

    return filtered;
  }, [gyms, filters]);

  const handleLocationRetrieve = (response: any) => {
    if (response.features?.[0]) {
      const feature = response.features[0];
      const { coordinates } = feature.properties || {};

      setFilters({
        ...filters,
        latitude: coordinates?.latitude || null,
        longitude: coordinates?.longitude || null,
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 mb-20">
      {/* Two Column Layout */}
      <Card className="w-full pt-0">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Left Column */}
          <div>
            <div className="gap-2 flex justify-between w-full mb-2">
              <h2 className="text-2xl font-bold mb-4">Search for Gyms</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters(initialFilters);
                }}
              >
                Reset All
              </Button>
            </div>

            <GymFilters
              filters={filters}
              onFiltersChange={setFilters}
              advancedOpen={advancedOpen}
            />

            {/* Advanced Filter Options Accordion */}
            <div className="mt-6 border border-2 rounded-lg">
              <Accordion
                type="single"
                collapsible
                value={advancedOpen ? "advanced" : ""}
                onValueChange={(value) => setAdvancedOpen(value === "advanced")}
              >
                <AccordionItem value="advanced">
                  <AccordionTrigger className="text-sm font-medium px-6 py-2">
                    Advanced filter options
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Filter gyms by distance from a location
                        </p>

                        <div className="flex items-center gap-2 text-sm">
                          <span>Within</span>
                          <Select
                            value={filters.distance.toString()}
                            onValueChange={(value) =>
                              setFilters({
                                ...filters,
                                distance: parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger className="w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="25">25</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                              <SelectItem value="250">250</SelectItem>
                            </SelectContent>
                          </Select>
                          <span>miles from</span>
                          <Select
                            value={locationType}
                            onValueChange={(
                              value: "" | "my-location" | "custom"
                            ) => {
                              setLocationType(value);

                              // Clear coordinates when changing location type
                              if (value !== "my-location") {
                                setFilters({
                                  ...filters,
                                  latitude: null,
                                  longitude: null,
                                });
                              }

                              // Automatically trigger location if "my-location" is selected
                              if (value === "my-location") {
                                handleUseMyLocation();
                              }
                            }}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="my-location">
                                My location
                              </SelectItem>
                              <SelectItem value="custom">
                                Enter Address
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {locationType === "custom" && (
                          <div className="mt-3">
                            <LocationSearchBox
                              onRetrieve={handleLocationRetrieve}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          {/* Right Column - Interactive Map */}
          <div>
            <div className="gap-2 flex justify-end w-full mb-4">
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                onClick={() => setViewMode("map")}
              >
                Map View
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
              >
                List View
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/training/gyms/new")}
              >
                <div className="flex">
                  <Plus className=" font-extrabold" />
                </div>
              </Button>
            </div>
            {gymsLoading ? (
              <div className="w-full h-96 rounded-lg bg-muted animate-pulse flex items-center justify-center">
                <p className="text-muted-foreground">Loading ...</p>
              </div>
            ) : filteredGyms.length > 0 ? (
              viewMode === "map" ? (
                <GymMap
                  gyms={filteredGyms}
                  onGymClick={(gym) =>
                    router.push(`/training/gyms/gym/${gym.id}`)
                  }
                  className="w-full h-96 rounded-lg border"
                />
              ) : (
                <GymList
                  gyms={filteredGyms}
                  onGymClick={(gym) =>
                    router.push(`/training/gyms/gym/${gym.id}`)
                  }
                  className="w-full h-96 border rounded-lg overflow-hidden"
                />
              )
            ) : (
              <div className="w-full h-96 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium">No gyms to display</p>
                  <p className="text-sm">Try adjusting your search terms</p>
                </div>
              </div>
            )}

            {/* Quick Stats below map */}
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Total Gyms</p>
                  <p className="text-2xl font-bold text-primary">
                    {gymsLoading ? "..." : gyms?.length || 0}
                  </p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Showing</p>
                  <p className="text-2xl font-bold text-primary">
                    {gymsLoading ? "..." : filteredGyms.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default connector(Gyms);
