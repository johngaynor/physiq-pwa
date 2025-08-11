"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Button } from "@/components/ui";
import {
  // Calendar,
  Plus,
  ChevronDown,
  Menu,
  Bell,
  // Dumbbell,
  // Target,
  // TrendingUp,
  // Award,
} from "lucide-react";
import { DateTime } from "luxon";

function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
  };
}

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const verses = [
  {
    text: "So whether you eat or drink or whatever you do, do all to the glory of God.",
    verse: "1 Corinthians 10:31",
  },
  {
    text: "Do you not know that your bodies are temples of the Holy Spirit… Therefore honor God with your bodies.",
    verse: "1 Corinthians 6:19–20",
  },
  {
    text: "For physical training is of some value, but godliness has value for all things…",
    verse: "1 Timothy 4:8",
  },
  {
    text: "And whatever you do, whether in word or deed, do it all in the name of the Lord Jesus…",
    verse: "Colossians 3:17",
  },
  {
    text: "Similarly, anyone who competes as an athlete does not receive the victor’s crown except by competing according to the rules.",
    verse: "2 Timothy 2:5",
  },
  {
    text: "No discipline seems pleasant at the time, but painful. Later on, however, it produces a harvest of righteousness…",
    verse: "Hebrews 12:11",
  },
  {
    text: "A wise man is full of strength, and a man of knowledge enhances his might.",
    verse: "Proverbs 24:5",
  },
];

const Training: React.FC<PropsFromRedux> = ({}) => {
  const [currentDate, setCurrentDate] = React.useState(DateTime.now());
  const [selectedDate, setSelectedDate] = React.useState(DateTime.now());
  const [currentVerse] = React.useState(
    verses[Math.floor(Math.random() * verses.length)]
  );

  // Generate calendar days for the current week
  const weekDays = React.useMemo(() => {
    const startOfWeek = currentDate.startOf("week");
    return Array.from({ length: 7 }, (_, i) => startOfWeek.plus({ days: i }));
  }, [currentDate]);

  const today = DateTime.now();

  // const handlePrevWeek = () => {
  //   setCurrentDate(currentDate.minus({ weeks: 1 }));
  // };

  // const handleNextWeek = () => {
  //   setCurrentDate(currentDate.plus({ weeks: 1 }));
  // };

  const handleToday = () => {
    const now = DateTime.now();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const handleRefreshCalendar = () => {
    handleToday();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Header with Navigation and Calendar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        {/* Top Navigation */}
        <div className="flex items-center justify-between p-4 pt-8">
          <Menu className="w-6 h-6" />
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">
              {currentDate.toFormat("MMM").toUpperCase()} &apos;
              {currentDate.toFormat("yy")}
            </span>
            <ChevronDown className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleToday}
              variant="outline"
              className="border-gray-600 hover:bg-gray-800"
            >
              TODAY
            </Button>
            <Bell className="w-6 h-6" />
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="pb-4">
          <div className="flex justify-between items-center px-4">
            {weekDays.map((day, index) => {
              const isSelected = day.hasSame(selectedDate, "day");
              const isToday = day.hasSame(today, "day");

              return (
                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setSelectedDate(day)}
                >
                  <span className="text-sm mb-2">{day.toFormat("dd")}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isSelected || isToday ? "bg-primary" : "bg-transparent"
                    }`}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-4 border-b"></div>
        </div>
      </div>

      {/* Scrollable Content with proper top padding */}
      <div className="flex-1 flex flex-col overflow-y-auto">
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
            <p className="text-lg leading-relaxed mb-6">{currentVerse.text}</p>

            {/* Author */}
            <p className="font-semibold text-lg">{currentVerse.verse}</p>
          </div>
        </div>

        {/* Refresh Calendar Button */}
        <div className="px-4 pb-8">
          <Button
            onClick={handleRefreshCalendar}
            variant="outline"
            className="w-full text-blue-400 border-blue-400 hover:bg-blue-900/20"
          >
            Refresh Calendar
          </Button>
        </div>
      </div>
      <div className="fixed bottom-24 right-6">
        <Button
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default connector(Training);
