"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { Button } from "@/components/ui";
import { Plus, Menu, Info, Check, X, Loader2 } from "lucide-react";
import { DateTime } from "luxon";
import WeeklyCalendar from "./components/WeeklyCalendar";
import MonthlyCalendar from "./components/MonthlyCalendar";
import SessionBox from "./components/SessionBox";
import verses from "./components/verses.json";
import { sessionsAPI, TrainingSession } from "../localDB";
import { syncSessions } from "../state/actions";
import DataView from "../components/DataView";
import { toast } from "sonner";

function mapStateToProps(state: RootState) {
  return {
    user: state.app.user,
    syncSessionsLoading: state.training.syncSessionsLoading,
    syncSessionsResult: state.training.syncSessionsResult,
  };
}

const connector = connect(mapStateToProps, { syncSessions });
type PropsFromRedux = ConnectedProps<typeof connector>;

const Training: React.FC<PropsFromRedux> = ({
  user,
  syncSessions,
  syncSessionsLoading,
  syncSessionsResult,
}) => {
  const [selectedDate, setSelectedDate] = React.useState(DateTime.now());
  const [sessions, setSessions] = React.useState<TrainingSession[]>([]);

  const selectedVerse = React.useMemo(() => {
    return verses[Math.floor(Math.random() * verses.length)];
  }, []);

  // Fetch all sessions from local database
  const fetchSessions = async () => {
    try {
      const allSessions = await sessionsAPI.getAll();
      // Filter out deleted sessions
      const activeSessions = allSessions.filter(
        (session) => session.syncStatus !== "deleted"
      );
      setSessions(activeSessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
    }
  };

  React.useEffect(() => {
    fetchSessions();
  }, []);

  // Handle sync toast notifications
  React.useEffect(() => {
    let toastId: string | number | undefined;

    if (syncSessionsLoading) {
      toastId = toast(
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
        {
          duration: Infinity, // Keep loading toast until dismissed
          className:
            "!w-12 !h-12 !min-h-0 !p-2 flex items-center justify-center",
          unstyled: false,
        }
      );
    }

    if (!syncSessionsLoading && syncSessionsResult === "success") {
      if (toastId) toast.dismiss(toastId);
      toast(<Check className="w-5 h-5 text-green-500" />, {
        duration: 2000,
        className: "!w-12 !h-12 !min-h-0 !p-2 flex items-center justify-center",
        unstyled: false,
      });
    }

    if (!syncSessionsLoading && syncSessionsResult === "error") {
      if (toastId) toast.dismiss(toastId);
      toast(<X className="w-5 h-5 text-red-500" />, {
        duration: 2000,
        className: "!w-12 !h-12 !min-h-0 !p-2 flex items-center justify-center",
        unstyled: false,
      });
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [syncSessionsLoading, syncSessionsResult]);

  const createNewSession = async () => {
    try {
      const sessionName = `Training Session - ${selectedDate.toFormat(
        "MMM dd, yyyy"
      )}`;
      const sessionDate = selectedDate.toISODate();

      await sessionsAPI.add({
        name: sessionName,
        date: sessionDate,
      });

      // Refresh sessions list
      const updatedSessions = await sessionsAPI.getAll();
      const activeSessions = updatedSessions.filter(
        (session) => session.syncStatus !== "deleted"
      );
      setSessions(activeSessions);
    } catch (error) {
      console.error("Error creating new session:", error);
    }
  };

  const todaySessions = sessions.filter((session) =>
    DateTime.fromISO(session.date).hasSame(selectedDate, "day")
  );

  const isAdmin = user?.apps.some((app) => app.id === 1);

  return (
    <div className="flex flex-col md:flex-row col-2 relative bg-blue-100">
      <div className="flex w-full md:flex-row flex-col">
        {/* Navbar for training - fixed only within left column */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-red-100">
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
              <Info
                className="w-6 h-6 cursor-pointer"
                onClick={() =>
                  alert("Sorry, this functionality is not available yet.")
                }
              />
            </div>
          </div>
          <WeeklyCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            sessions={sessions}
          />
          <div className="border-b"></div>
        </div>
        <div className="flex-1 flex flex-col h-screen">
          {/* Main content */}
          {todaySessions.length > 0 ? (
            <div className="">
              {todaySessions.map((session, index) => (
                <React.Fragment key={"session" + index}>
                  <SessionBox
                    session={session}
                    onSessionUpdate={fetchSessions}
                  />
                  {index < todaySessions.length - 1 && (
                    <div className="border-b-40 border-slate-900"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center px-8">
              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <div className="w-12 h-12 bg-cyan-400 rounded-lg flex items-center justify-center transform rotate-12">
                    <div className="w-8 h-8 bg-cyan-300 rounded-sm transform -rotate-6"></div>
                  </div>
                </div>
                <p className="text-lg leading-relaxed mb-6">
                  {selectedVerse.text}
                </p>
                <p className="font-semibold text-lg">{selectedVerse.verse}</p>
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-24 right-6">
          <Button
            onClick={createNewSession}
            className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
            size="icon"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
      {isAdmin && (
        <DataView
          syncSessions={syncSessions}
          syncSessionsLoading={syncSessionsLoading}
        />
      )}
    </div>
  );
};

export default connector(Training);
