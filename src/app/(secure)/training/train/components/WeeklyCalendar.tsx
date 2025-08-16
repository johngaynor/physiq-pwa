"use client";
import React from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { DateTime } from "luxon";
import { TrainingSession } from "../../localDB";

interface WeeklyCalendarProps {
  selectedDate: DateTime;
  setSelectedDate: (date: DateTime) => void;
  sessions: TrainingSession[];
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  selectedDate,
  setSelectedDate,
  sessions,
}) => {
  // Generate calendar days for the current week
  const weekDays = React.useMemo(() => {
    const startOfWeek = selectedDate.startOf("week");
    return Array.from({ length: 7 }, (_, i) => startOfWeek.plus({ days: i }));
  }, [selectedDate]);

  const [animationDirection, setAnimationDirection] = React.useState<
    "left" | "right" | null
  >(null);

  const handlePrevWeek = () => {
    setAnimationDirection("left");
    setSelectedDate(selectedDate.minus({ weeks: 1 }));
  };

  const handleNextWeek = () => {
    setAnimationDirection("right");
    setSelectedDate(selectedDate.plus({ weeks: 1 }));
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevWeek();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNextWeek();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevWeek, handleNextWeek]);

  const handleSwipe = (event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      handlePrevWeek();
    } else if (info.offset.x < -swipeThreshold) {
      handleNextWeek();
    }
  };

  // Animation variants for sliding
  const slideVariants = {
    enter: (direction: "left" | "right" | null) => ({
      x: direction === "right" ? 300 : direction === "left" ? -300 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right" | null) => ({
      x: direction === "right" ? -300 : direction === "left" ? 300 : 0,
      opacity: 0,
    }),
  };

  return (
    <div className="">
      <AnimatePresence mode="wait" custom={animationDirection}>
        <motion.div
          key={selectedDate.startOf("week").toISO()}
          custom={animationDirection}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: "tween",
            duration: 0.3,
            ease: "easeInOut",
          }}
          onPanEnd={handleSwipe}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          className="flex justify-between items-center cursor-grab active:cursor-grabbing w-full"
        >
          {weekDays.map((day, index) => {
            const isSelected = day.hasSame(selectedDate, "day");
            const hasSession = sessions.some(session => 
              DateTime.fromISO(session.date).hasSame(day, "day") && 
              session.syncStatus !== 'deleted'
            );

            return (
              <div
                key={`${day.toISO()}-${index}`}
                className="flex flex-col items-center cursor-pointer p-2 rounded-t-lg hover:bg-slate-800 dark:hover:bg-slate-800 transition-colors h-15 w-15"
                onClick={() => setSelectedDate(day)}
              >
                <span className="text-sm mb-2 font-medium">
                  {day.toFormat("dd")}
                </span>
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isSelected 
                      ? "bg-primary" 
                      : hasSession 
                      ? "bg-gray-400" 
                      : "bg-transparent"
                  }`}
                />
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WeeklyCalendar;
