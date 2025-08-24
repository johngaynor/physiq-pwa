"use client";
import React from "react";
import { Input, Checkbox } from "@/components/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filters } from "../types";
import tagOptions from "./TagOptions.json";

interface GymFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  advancedOpen: boolean;
}

const GymFilters: React.FC<GymFiltersProps> = ({
  filters,
  onFiltersChange,
  advancedOpen,
}) => {
  const setFilters = (newFilters: Filters) => {
    onFiltersChange(newFilters);
  };

  return (
    <>
      {/* Search Input */}
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
                checked={filters.dayPasses.includes(1)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      dayPasses: [...filters.dayPasses, 1],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      dayPasses: filters.dayPasses.filter(
                        (d: number | null) => d !== 1
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
                checked={filters.dayPasses.includes(0)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      dayPasses: [...filters.dayPasses, 0],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      dayPasses: filters.dayPasses.filter(
                        (d: number | null) => d !== 0
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
                        (d: number | null) => d !== null
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
                variant={filters.tags.includes(tag) ? "default" : "outline"}
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
    </>
  );
};

export default GymFilters;
