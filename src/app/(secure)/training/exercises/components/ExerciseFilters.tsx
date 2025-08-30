import React from "react";
import { Input, Label } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";

// Hardcoded muscle group tags - should match the ones in ExerciseForm
const MUSCLE_GROUPS = [
  { id: 1, name: "Quads" },
  { id: 2, name: "Calves" },
  { id: 3, name: "Hamstrings" },
  { id: 4, name: "Glutes" },
  { id: 5, name: "Abs" },
  { id: 6, name: "Chest" },
  { id: 7, name: "Rear Delts" },
  { id: 8, name: "Front Delts" },
  { id: 9, name: "Side Delts" },
  { id: 10, name: "Triceps" },
  { id: 11, name: "Biceps" },
  { id: 12, name: "Forearms" },
  { id: 13, name: "Back" },
  { id: 14, name: "Cardio" },
];

// Hardcoded exercise units
const EXERCISE_UNITS = [
  { id: 1, name: "Weight", measurement: "number" },
  { id: 2, name: "Reps", measurement: "number" },
  { id: 3, name: "Time", measurement: "time" },
  { id: 4, name: "BPM", measurement: "number" },
];

export interface ExerciseFilters {
  search: string;
  targets: string[];
  units: string[];
}

export const initialExerciseFilters: ExerciseFilters = {
  search: "",
  targets: [],
  units: [],
};

interface ExerciseFiltersProps {
  filters: ExerciseFilters;
  onFiltersChange: (filters: ExerciseFilters) => void;
}

const ExerciseFiltersComponent: React.FC<ExerciseFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleTargetToggle = (targetName: string, checked: boolean) => {
    const newTargets = checked
      ? [...filters.targets, targetName]
      : filters.targets.filter((t) => t !== targetName);

    onFiltersChange({
      ...filters,
      targets: newTargets,
    });
  };

  const handleUnitToggle = (unitName: string, checked: boolean) => {
    const newUnits = checked
      ? [...filters.units, unitName]
      : filters.units.filter((t) => t !== unitName);

    onFiltersChange({
      ...filters,
      units: newUnits,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <Label htmlFor="search" className="text-sm font-medium">
          Search by Exercise Name
        </Label>
        <Input
          id="search"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search exercises..."
          className="mt-1"
          type="text"
        />
      </div>

      {/* Target Muscle Groups and Units Filters - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Muscle Groups Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Filter by Muscle Groups
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {MUSCLE_GROUPS.map((muscle) => (
              <div key={muscle.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`target-${muscle.id}`}
                  checked={filters.targets.includes(muscle.name)}
                  onCheckedChange={(checked) =>
                    handleTargetToggle(muscle.name, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`target-${muscle.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {muscle.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Units Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Filter by Units
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {EXERCISE_UNITS.map((unit) => (
              <div
                key={`unit-${unit.id}`}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={`unit-${unit.id}`}
                  checked={filters.units.includes(unit.name)}
                  onCheckedChange={(checked) =>
                    handleUnitToggle(unit.name, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`unit-${unit.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {unit.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseFiltersComponent;
