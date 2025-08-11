"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Button, H1, H2, H3 } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Plus,
  ChevronDown,
  Menu,
  Bell,
  Dumbbell,
  Target,
  TrendingUp,
  Award,
} from "lucide-react";
import { DateTime } from "luxon";

function mapStateToProps(state: RootState) {
  return {};
}

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const motivationalQuotes = [
  {
    text: "Never give up, never give in, and when the upper hand is ours, may we have the ability to handle the win with the dignity that we absorbed the loss.",
    author: "Doug Williams",
  },
  {
    text: "The only way to achieve the impossible is to believe it is possible.",
    author: "Charles Kingsleigh",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
];

const Training: React.FC<PropsFromRedux> = ({}) => {
  const [currentDate, setCurrentDate] = React.useState(DateTime.now());
  const [selectedDate, setSelectedDate] = React.useState(DateTime.now());
  const [currentQuote] = React.useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  // Generate calendar days for the current week
  const weekDays = React.useMemo(() => {
    const startOfWeek = currentDate.startOf("week");
    return Array.from({ length: 7 }, (_, i) => startOfWeek.plus({ days: i }));
  }, [currentDate]);

  const today = DateTime.now();

  const handlePrevWeek = () => {
    setCurrentDate(currentDate.minus({ weeks: 1 }));
  };

  const handleNextWeek = () => {
    setCurrentDate(currentDate.plus({ weeks: 1 }));
  };

  const handleToday = () => {
    const now = DateTime.now();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const handleRefreshCalendar = () => {
    handleToday();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-16">
        <Menu className="w-6 h-6" />
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">
            {currentDate.toFormat("MMM").toUpperCase()} '{currentDate.toFormat("yy")}
          </span>
          <ChevronDown className="w-5 h-5" />
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleToday}
            variant="outline"
            className="text-white border-gray-600 hover:bg-gray-800"
          >
            TODAY
          </Button>
          <Bell className="w-6 h-6" />
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center">
          {weekDays.map((day, index) => {
            const isSelected = day.hasSame(selectedDate, "day");
            const isToday = day.hasSame(today, "day");
            
            return (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedDate(day)}
              >
                <span className="text-sm text-gray-400 mb-2">
                  {day.toFormat("dd")}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSelected || isToday
                      ? "bg-white"
                      : "bg-transparent"
                  }`}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-4 border-b border-gray-700"></div>
      </div>

      {/* Main Content Area - Motivational Quote */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="text-center">
          {/* Quote Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-cyan-400 rounded-lg flex items-center justify-center transform rotate-12">
              <div className="w-8 h-8 bg-cyan-300 rounded-sm transform -rotate-6"></div>
            </div>
          </div>
          
          {/* Quote Text */}
          <p className="text-lg leading-relaxed mb-6 text-gray-300">
            {currentQuote.text}
          </p>
          
          {/* Author */}
          <p className="text-white font-semibold text-lg">
            {currentQuote.author}
          </p>
        </div>
      </div>

      {/* Refresh Calendar Button */}
      <div className="px-4 mb-8">
        <Button
          onClick={handleRefreshCalendar}
          variant="outline"
          className="w-full text-blue-400 border-blue-400 hover:bg-blue-900/20"
        >
          Refresh Calendar
        </Button>
      </div>

      {/* Floating Plus Button */}
      <div className="fixed bottom-24 right-6">
        <Button
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default connector(Training);
