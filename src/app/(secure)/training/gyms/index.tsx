"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getGyms } from "../state/actions";
import { Button, Input, Skeleton } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
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

// interface Filters {
//   search: string;
//   ratingMin: number;
//   ratingMax: number;
//   tags: string[];
// }

const connector = connect(mapStateToProps, {
  getGyms,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Gyms: React.FC<PropsFromRedux> = ({ gyms, gymsLoading, getGyms }) => {
  const router = useRouter();
  const [search, setSearch] = React.useState<string>("");
  const [viewMode, setViewMode] = React.useState<"map" | "list">("list");

  React.useEffect(() => {
    if (!gyms && !gymsLoading) getGyms();
  }, [gyms, gymsLoading, getGyms]);

  // Filter gyms based on search
  const filteredGyms = React.useMemo(() => {
    if (!gyms) return [];

    if (!search.trim()) return gyms;

    return gyms.filter(
      (gym) =>
        gym.name.toLowerCase().includes(search.toLowerCase()) ||
        gym.fullAddress.toLowerCase().includes(search.toLowerCase())
    );
  }, [gyms, search]);

  return (
    <div className="w-full flex flex-col gap-4 mb-20">
      {/* Two Column Layout */}
      <Card className="w-full">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Left Column */}
          <div>
            <div className="gap-2 flex justify-between w-full mb-2">
              <h2 className="text-2xl font-bold mb-4">Filters</h2>
              <Button
                variant="outline"
                onClick={() =>
                  alert("this functionality is not available yet.")
                }
              >
                Reset
              </Button>
            </div>

            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gyms..."
              className="flex-1"
              type="text"
            />
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
                          <TableHead>Address</TableHead>
                          <TableHead className="w-[100px]">Cost</TableHead>
                          <TableHead className="w-[120px]">Day Passes</TableHead>
                          <TableHead className="w-[150px]">Tags</TableHead>
                          <TableHead className="w-[100px] text-center">
                            Sessions
                          </TableHead>
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
                              {gym.fullAddress}
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
                                  : "Unknown"
                                }
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
                            <TableCell className="text-center">
                              {gym.yourSessions || 0}
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
                  <p className="text-sm">
                    {search.trim()
                      ? "Try adjusting your search terms"
                      : "Add your first gym to see it on the map"}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Stats below map */}
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Total Gyms</p>
                  <p className="text-2xl font-bold text-primary">
                    {gymsLoading ? (
                      <Skeleton className="h-6 w-8 mx-auto" />
                    ) : (
                      gyms?.length || 0
                    )}
                  </p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Showing</p>
                  <p className="text-2xl font-bold text-primary">
                    {gymsLoading ? (
                      <Skeleton className="h-6 w-8 mx-auto" />
                    ) : (
                      filteredGyms.length
                    )}
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
