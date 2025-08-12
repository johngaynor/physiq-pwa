"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getGyms, editGym, deleteGym } from "../state/actions";
import { Button, Input, Skeleton } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import { GymForm } from "./components/GymForm";
import type { Gym } from "../state/types";

function mapStateToProps(state: RootState) {
  return {
    gyms: state.training.gyms,
    gymsLoading: state.training.gymsLoading,
  };
}

const connector = connect(mapStateToProps, {
  getGyms,
  editGym,
  deleteGym,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Gyms: React.FC<PropsFromRedux> = ({
  gyms,
  gymsLoading,
  getGyms,
  editGym,
  deleteGym,
}) => {
  const [search, setSearch] = React.useState<string>("");

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
        gym.address.toLowerCase().includes(search.toLowerCase())
    );
  }, [gyms, search]);
  const handleDelete = (gymId: number) => {
    if (window.confirm("Are you sure you want to delete this gym?")) {
      deleteGym(gymId);
    }
  };

  const handleSubmitNew = (values: { name: string; address: string }) => {
    editGym(null, values.name, values.address);
  };

  const createEditHandler =
    (gym: Gym) => (values: { name: string; address: string }) => {
      editGym(gym.id, values.name, values.address);
    };

  return (
    <div className="w-full flex flex-col gap-4 mb-20">
      {/* Search and Add Button */}
      <div className="flex gap-2">
        <Input
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search gyms..."
          className="flex-1"
          type="text"
        />
        <GymForm
          Trigger={
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Gym
            </Button>
          }
          title="Add New Gym"
          description="Create a new gym location for your training sessions."
          initialValues={{ name: "", address: "" }}
          onSubmit={handleSubmitNew}
        />
      </div>

      {/* Gyms Table */}
      <Card className="w-full">
        <CardContent className="p-0">
          {gymsLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-5 w-32" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-5 w-40" />
                  </TableHead>
                  <TableHead className="text-center">
                    <Skeleton className="h-5 w-16" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={`gym-loading-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-60" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : filteredGyms.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gym Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGyms.map((gym) => (
                  <TableRow key={gym.id}>
                    <TableCell className="font-medium">{gym.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {gym.address}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <GymForm
                          Trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit gym</span>
                            </Button>
                          }
                          title="Edit Gym"
                          description="Update the gym name and address."
                          initialValues={{
                            name: gym.name,
                            address: gym.address,
                          }}
                          onSubmit={createEditHandler(gym)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(gym.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete gym</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                {search.trim()
                  ? "No gyms found matching your search."
                  : "No gyms found."}
              </p>
              <p className="text-sm mt-1">
                {search.trim()
                  ? "Try adjusting your search terms."
                  : "Add your first gym to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default connector(Gyms);
