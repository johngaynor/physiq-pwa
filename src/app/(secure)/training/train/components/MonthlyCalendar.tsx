"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateTime } from "luxon";

interface MonthlyCalendarProps {
  selectedDate: DateTime;
  setSelectedDate: (date: DateTime) => void;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">
              {selectedDate.toFormat("MMM").toUpperCase()} &apos;
              {selectedDate.toFormat("yy")}
            </span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate.toJSDate()}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (date) {
                setSelectedDate(DateTime.fromJSDate(date));
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthlyCalendar;
