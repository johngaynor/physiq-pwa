"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getGyms } from "../state/actions";
import { Button, Input } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
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

function mapStateToProps(state: RootState) {
  return {
    gyms: state.training.gyms,
    gymsLoading: state.training.gymsLoading,
  };
}

const connector = connect(mapStateToProps, {
  getGyms,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Gyms: React.FC<PropsFromRedux> = ({ gyms, gymsLoading, getGyms }) => {
  const router = useRouter();
  const [viewMode, setViewMode] = React.useState<"map" | "list">("list");
  const [filters, setFilters] = React.useState<Filters>(initialFilters);
  const [advancedOpen, setAdvancedOpen] = React.useState<boolean>(true); // set back to false
  const [userLocation, setUserLocation] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  React.useEffect(() => {
    if (!gyms && !gymsLoading) getGyms();
  }, [gyms, gymsLoading, getGyms]);

  // Get user's location
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Don't set userLocation, keep it null if location access fails
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

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

      return matchesSearch && matchesCost && matchesDayPasses && matchesTags;
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

            <Input
              id="search"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="Search by text..."
              className="flex-1"
              type="text"
            />
            
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
                    <p className="text-sm text-muted-foreground">
                      This feature is not yet available... location filters
                      coming soon! Within ___ miles from ___ location
                    </p>
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
