"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { Button } from "@/components/ui";
import { Plus, Menu, Info } from "lucide-react";
import { DateTime } from "luxon";
import WeeklyCalendar from "./components/WeeklyCalendar";
import MonthlyCalendar from "./components/MonthlyCalendar";
import verses from "./components/verses.json";

function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
  };
}

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Training: React.FC<PropsFromRedux> = ({}) => {
  const [selectedDate, setSelectedDate] = React.useState(DateTime.now());

  const selectedVerse = React.useMemo(() => {
    return verses[Math.floor(Math.random() * verses.length)];
  }, [selectedDate]);

  return (
    <div className="flex flex-col bg-blue-100 h-[800px]">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <div className="flex items-center justify-between p-4 pt-8">
          <Menu
            className="w-6 h-6 cursor-pointer"
            onClick={() =>
              alert("Sorry, this functionality is not available yet.")
            }
          />
          <MonthlyCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setSelectedDate(DateTime.now())}
              variant="outline"
              className="border-slate-600 hover:bg-slate-600"
            >
              TODAY
            </Button>
            <Info className="w-6 h-6" />
          </div>
        </div>
        <WeeklyCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <div className="border-b"></div>
      </div>

      {/* Scrollable Content with proper top padding */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-red-100 h-full">
        {/* Main Content Area - Motivational Quote */}
        <div className="flex-1 flex items-center justify-center px-8">
          {/* Scripture reference */}
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-12 h-12 bg-cyan-400 rounded-lg flex items-center justify-center transform rotate-12">
                <div className="w-8 h-8 bg-cyan-300 rounded-sm transform -rotate-6"></div>
              </div>
            </div>
            <p className="text-lg leading-relaxed mb-6">{selectedVerse.text}</p>
            <p className="font-semibold text-lg">{selectedVerse.verse}</p>
          </div>
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
