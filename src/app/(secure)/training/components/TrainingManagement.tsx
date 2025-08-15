"use client";
import React from "react";
import { sessionsAPI, exercisesAPI, setsAPI } from "../localDB";

interface TrainingManagementProps {
  completeData: any[];
  selectedSession: string | null;
  setSelectedSession: (sessionId: string | null) => void;
  selectedExercise: string | null;
  setSelectedExercise: (exerciseId: string | null) => void;
  onRefreshData: () => Promise<void>;
}

const TrainingManagement: React.FC<TrainingManagementProps> = ({
  completeData,
  selectedSession,
  setSelectedSession,
  selectedExercise,
  setSelectedExercise,
  onRefreshData,
}) => {
  const [newSessionName, setNewSessionName] = React.useState("");
  const [newExerciseName, setNewExerciseName] = React.useState("");
  const [newSetData, setNewSetData] = React.useState({ reps: 0, weight: 0 });

  // Session CRUD
  const addSession = async () => {
    if (!newSessionName.trim()) return;

    await sessionsAPI.add({
      name: newSessionName,
      date: new Date().toISOString().split("T")[0],
    });

    setNewSessionName("");
    await onRefreshData();
  };

  const deleteSession = async (sessionId: string) => {
    await sessionsAPI.delete(sessionId);
    if (selectedSession === sessionId) {
      setSelectedSession(null);
      setSelectedExercise(null);
    }
    await onRefreshData();
  };

  // Exercise CRUD
  const addExercise = async () => {
    if (!selectedSession || !newExerciseName.trim()) return;

    await exercisesAPI.add({
      sessionId: selectedSession,
      name: newExerciseName,
    });

    setNewExerciseName("");
    await onRefreshData();
  };

  const deleteExercise = async (exerciseId: string) => {
    await exercisesAPI.delete(exerciseId);
    if (selectedExercise === exerciseId) {
      setSelectedExercise(null);
    }
    await onRefreshData();
  };

  // Set CRUD
  const addSet = async () => {
    if (!selectedExercise) return;

    await setsAPI.add({
      exerciseId: selectedExercise,
      reps: newSetData.reps,
      weight: newSetData.weight,
    });

    setNewSetData({ reps: 0, weight: 0 });
    await onRefreshData();
  };

  const deleteSet = async (setId: string) => {
    await setsAPI.delete(setId);
    await onRefreshData();
  };

  const clearAllData = async () => {
    await sessionsAPI.clear();
    await exercisesAPI.clear();
    await setsAPI.clear();
    setSelectedSession(null);
    setSelectedExercise(null);
    await onRefreshData();
  };

  return (
    <div className="w-1/2 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Training Management</h2>

      {/* Global Actions */}
      <div className="mb-6">
        <button
          onClick={clearAllData}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear All Data
        </button>
      </div>

      {/* Sessions Section */}
      <div className="mb-6 border-b pb-4">
        <h3 className="text-lg font-semibold mb-2">Sessions</h3>

        {/* Add Session */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            placeholder="Session name"
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={addSession}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Session
          </button>
        </div>

        {/* Sessions List */}
        <div className="space-y-2">
          {completeData.map((session) => (
            <div
              key={session.id}
              className={`p-3 border rounded cursor-pointer ${
                selectedSession === session.id
                  ? "bg-blue-100 border-blue-300"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => {
                setSelectedSession(session.id);
                setSelectedExercise(null);
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{session.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({session.date})
                  </span>
                  <span
                    className={`text-xs ml-2 px-2 py-1 rounded ${
                      session.syncStatus === "synced"
                        ? "bg-green-100 text-green-800"
                        : session.syncStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : session.syncStatus === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-red-200 text-red-900"
                    }`}
                  >
                    {session.syncStatus}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exercises Section */}
      {selectedSession && (
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">Exercises</h3>

          {/* Add Exercise */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              placeholder="Exercise name"
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              onClick={addExercise}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Exercise
            </button>
          </div>

          {/* Exercises List */}
          <div className="space-y-2">
            {completeData
              .find((s) => s.id === selectedSession)
              ?.exercises?.map((exercise: any) => (
                <div
                  key={exercise.id}
                  className={`p-2 border rounded cursor-pointer ${
                    selectedExercise === exercise.id
                      ? "bg-green-100 border-green-300"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedExercise(exercise.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{exercise.name}</span>
                      <span
                        className={`text-xs ml-2 px-2 py-1 rounded ${
                          exercise.syncStatus === "synced"
                            ? "bg-green-100 text-green-800"
                            : exercise.syncStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : exercise.syncStatus === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-red-200 text-red-900"
                        }`}
                      >
                        {exercise.syncStatus}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteExercise(exercise.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Sets Section */}
      {selectedExercise && (
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Sets</h3>

          {/* Add Set */}
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              value={newSetData.reps}
              onChange={(e) =>
                setNewSetData({
                  ...newSetData,
                  reps: parseInt(e.target.value) || 0,
                })
              }
              placeholder="Reps"
              className="w-20 border rounded px-3 py-2"
            />
            <input
              type="number"
              step="0.5"
              value={newSetData.weight}
              onChange={(e) =>
                setNewSetData({
                  ...newSetData,
                  weight: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Weight"
              className="w-24 border rounded px-3 py-2"
            />
            <button
              onClick={addSet}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            >
              Add Set
            </button>
          </div>

          {/* Sets List */}
          <div className="space-y-2 overflow-auto">
            {completeData
              .find((s) => s.id === selectedSession)
              ?.exercises?.find((e: any) => e.id === selectedExercise)
              ?.sets?.map((set: any, index: number) => (
                <div key={set.id} className="p-2 border rounded bg-purple-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <span>
                        Set {index + 1}: {set.reps} reps @ {set.weight} lbs
                      </span>
                      <span
                        className={`text-xs ml-2 px-2 py-1 rounded ${
                          set.syncStatus === "synced"
                            ? "bg-green-100 text-green-800"
                            : set.syncStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : set.syncStatus === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-red-200 text-red-900"
                        }`}
                      >
                        {set.syncStatus}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteSet(set.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingManagement;
