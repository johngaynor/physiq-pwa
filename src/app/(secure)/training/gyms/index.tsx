"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getGyms } from "../state/actions";
import { Button, Input, Checkbox } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import tagOptions from "./components/TagOptions.json";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import MapComponent from "./components/MapComponent";

function mapStateToProps(state: RootState) {
  return {
    gyms: state.training.gyms,
    gymsLoading: state.training.gymsLoading,
  };
}

interface Filters {
  search: string;
  cost: number[];
  dayPasses: (boolean | null)[];
  sortMethod: "costAsc" | "costDesc" | "ratingAsc" | "ratingDesc";
  tags: string[];
}

const initialFilters = {
  search: "",
  cost: [1, 2, 3],
  dayPasses: [true, false, null],
  sortMethod: "ratingDesc" as const,
  tags: [],
};

const connector = connect(mapStateToProps, {
  getGyms,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Gyms: React.FC<PropsFromRedux> = ({ gyms, gymsLoading, getGyms }) => {
  const router = useRouter();
  const [viewMode, setViewMode] = React.useState<"map" | "list">("list");
  const [filters, setFilters] = React.useState<Filters>(initialFilters);
  const [advancedOpen, setAdvancedOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!gyms && !gymsLoading) getGyms();
  }, [gyms, gymsLoading, getGyms]);

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
            {/* Filter Checkboxes */}
            <div className="mt-4 grid grid-cols-2 gap-6">
              {/* Cost Filter */}
              <div>
                <h3 className="font-medium mb-2">Cost</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cost-1"
                      checked={filters.cost.includes(1)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            cost: [...filters.cost, 1],
                          });
                        } else {
                          setFilters({
                            ...filters,
                            cost: filters.cost.filter((c: number) => c !== 1),
                          });
                        }
                      }}
                    />
                    <label htmlFor="cost-1" className="text-sm">
                      $ ($0-40)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cost-2"
                      checked={filters.cost.includes(2)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            cost: [...filters.cost, 2],
                          });
                        } else {
                          setFilters({
                            ...filters,
                            cost: filters.cost.filter((c: number) => c !== 2),
                          });
                        }
                      }}
                    />
                    <label htmlFor="cost-2" className="text-sm">
                      $$ ($40-100)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cost-3"
                      checked={filters.cost.includes(3)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            cost: [...filters.cost, 3],
                          });
                        } else {
                          setFilters({
                            ...filters,
                            cost: filters.cost.filter((c: number) => c !== 3),
                          });
                        }
                      }}
                    />
                    <label htmlFor="cost-3" className="text-sm">
                      $$$ ($100+)
                    </label>
                  </div>
                </div>
              </div>

              {/* Day Passes Filter */}
              <div>
                <h3 className="font-medium mb-2">Offers day passes?</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="daypass-yes"
                      checked={filters.dayPasses.includes(true)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            dayPasses: [...filters.dayPasses, true],
                          });
                        } else {
                          setFilters({
                            ...filters,
                            dayPasses: filters.dayPasses.filter(
                              (d: boolean | null) => d !== true
                            ),
                          });
                        }
                      }}
                    />
                    <label htmlFor="daypass-yes" className="text-sm">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="daypass-no"
                      checked={filters.dayPasses.includes(false)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            dayPasses: [...filters.dayPasses, false],
                          });
                        } else {
                          setFilters({
                            ...filters,
                            dayPasses: filters.dayPasses.filter(
                              (d: boolean | null) => d !== false
                            ),
                          });
                        }
                      }}
                    />
                    <label htmlFor="daypass-no" className="text-sm">
                      No
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="daypass-unsure"
                      checked={filters.dayPasses.includes(null)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            dayPasses: [...filters.dayPasses, null],
                          });
                        } else {
                          setFilters({
                            ...filters,
                            dayPasses: filters.dayPasses.filter(
                              (d: boolean | null) => d !== null
                            ),
                          });
                        }
                      }}
                    />
                    <label htmlFor="daypass-unsure" className="text-sm">
                      Unsure
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort Method Filters */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              {/* Sort by Price */}
              <div>
                <h3 className="font-medium mb-2">Sort by Price</h3>
                <RadioGroup
                  value={filters.sortMethod}
                  onValueChange={(
                    value: "costAsc" | "costDesc" | "ratingAsc" | "ratingDesc"
                  ) => setFilters({ ...filters, sortMethod: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="costAsc" id="sort-cost-asc" />
                    <Label htmlFor="sort-cost-asc" className="text-sm">
                      Low to High
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="costDesc" id="sort-cost-desc" />
                    <Label htmlFor="sort-cost-desc" className="text-sm">
                      High to Low
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Sort by Rating */}
              <div>
                <h3 className="font-medium mb-2">Sort by Rating</h3>
                <RadioGroup
                  value={filters.sortMethod}
                  onValueChange={(
                    value: "costAsc" | "costDesc" | "ratingAsc" | "ratingDesc"
                  ) => setFilters({ ...filters, sortMethod: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ratingDesc" id="sort-rating-desc" />
                    <Label htmlFor="sort-rating-desc" className="text-sm">
                      High to Low
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ratingAsc" id="sort-rating-asc" />
                    <Label htmlFor="sort-rating-asc" className="text-sm">
                      Low to High
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Tags Filter */}
            {!advancedOpen && (
              <div className="mt-6 transition-opacity duration-300">
                <h3 className="font-medium mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        filters.tags.includes(tag) ? "default" : "outline"
                      }
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => {
                        if (filters.tags.includes(tag)) {
                          // Remove tag if already selected
                          setFilters({
                            ...filters,
                            tags: filters.tags.filter((t) => t !== tag),
                          });
                        } else {
                          // Add tag if not selected
                          setFilters({
                            ...filters,
                            tags: [...filters.tags, tag],
                          });
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

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
                <MapComponent
                  gyms={filteredGyms}
                  onGymClick={(gym) =>
                    router.push(`/training/gyms/gym/${gym.id}`)
                  }
                  className="w-full h-96 rounded-lg border"
                />
              ) : (
                <div className="w-full h-96 border rounded-lg overflow-hidden">
                  <div className="h-full overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow>
                          <TableHead className="w-[200px]">Gym Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead className="w-[100px]">Cost</TableHead>
                          <TableHead className="w-[120px]">
                            Day Passes
                          </TableHead>
                          <TableHead className="w-[150px]">Tags</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredGyms.map((gym) => (
                          <TableRow
                            key={gym.id}
                            className="cursor-pointer hover:bg-accent"
                            onClick={() =>
                              router.push(`/training/gyms/gym/${gym.id}`)
                            }
                          >
                            <TableCell className="font-medium">
                              {gym.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {gym.city}, {gym.state}
                            </TableCell>
                            <TableCell>
                              <span className="text-lg">
                                {gym.cost === 1 && "$"}
                                {gym.cost === 2 && "$$"}
                                {gym.cost === 3 && "$$$"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  gym.dayPasses === true
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : gym.dayPasses === false
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                }`}
                              >
                                {gym.dayPasses === true
                                  ? "Available"
                                  : gym.dayPasses === false
                                  ? "Not Available"
                                  : "Unknown"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {gym.tags?.slice(0, 2).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {gym.tags && gym.tags.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{gym.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
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
