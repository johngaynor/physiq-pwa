"use client";
import React from "react";
import {
  syncAPI,
  getFlattenedDataWithTypes,
  getCompleteSessionData,
} from "../localDB";
import { toast } from "sonner";
import { Loader, Check } from "lucide-react";

interface DataViewProps {
  onDataChange?: () => void; // Optional callback for when data changes
  syncSessions: (records: any) => void;
  syncSessionsLoading: boolean;
}

const DataView: React.FC<DataViewProps> = ({
  onDataChange,
  syncSessions,
  syncSessionsLoading,
}) => {
  const [completeData, setCompleteData] = React.useState<any[]>([]);
  const [flattenedData, setFlattenedData] = React.useState<any[]>([]);
  const [viewMode, setViewMode] = React.useState<"json" | "table">("table");
  const [syncStatus, setSyncStatus] = React.useState<any>(null);
  const [countdown, setCountdown] = React.useState(10);
  const [toastId, setToastId] = React.useState<string | number | null>(null);
  const [lastSyncedData, setLastSyncedData] = React.useState<{
    sessionIds: string[];
    deletedSessionsCount: number;
  } | null>(null);

  const refreshData = async () => {
    const data = await getCompleteSessionData();
    const flattened = await getFlattenedDataWithTypes();
    setCompleteData(data);
    setFlattenedData(flattened);

    // Update sync status
    const status = await syncAPI.getSyncStatusSummary();
    setSyncStatus(status);

    // Notify parent if callback provided
    onDataChange?.();
  };

  React.useEffect(() => {
    refreshData();

    // Set up interval to refresh sync status periodically
    const statusInterval = setInterval(async () => {
      const status = await syncAPI.getSyncStatusSummary();
      setSyncStatus(status);
    }, 5000); // Refresh every 5 seconds

    // Set up auto-sync timer with countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Trigger sync when countdown reaches 0
          if (!syncSessionsLoading) {
            triggerSync();
          }
          return 10; // Reset countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(countdownInterval);
    };
  }, [syncSessionsLoading]);

  // Handle toast updates when syncSessionsLoading changes
  React.useEffect(() => {
    const handleSyncCompletion = async () => {
      if (!syncSessionsLoading && toastId !== null && lastSyncedData) {
        try {
          // Mark pending records as synced using the stored data
          if (lastSyncedData.sessionIds.length) {
            await syncAPI.markBatchSynced({
              sessionIds: lastSyncedData.sessionIds,
            });
          }

          // Clean up deleted records if there were any
          if (lastSyncedData.deletedSessionsCount > 0) {
            await syncAPI.cleanupSyncedDeletions();
          }

          // Refresh data to update the UI
          await refreshData();

          // Show success with checkbox
          toast(<Check className="w-5 h-5 text-green-500" />, {
            id: toastId,
            duration: 2000, // Auto-dismiss after 2 seconds
            className:
              "!w-12 !h-12 !min-h-0 !p-2 flex items-center justify-center",
            unstyled: false,
          });
        } catch (error) {
          console.error("Error handling sync completion:", error);
          // Show error state
          toast(<Check className="w-5 h-5 text-red-500" />, {
            id: toastId,
            duration: 2000,
            className:
              "!w-12 !h-12 !min-h-0 !p-2 flex items-center justify-center",
            unstyled: false,
          });
        }
        setToastId(null); // Clear the toast ID
        setLastSyncedData(null); // Clear the sync data
      }
    };

    handleSyncCompletion();
  }, [syncSessionsLoading, toastId, lastSyncedData]);

  const triggerSync = async () => {
    if (syncSessionsLoading) return; // Prevent multiple simultaneous syncs

    const pendingData = await syncAPI.getAllPendingSync();
    const deletedData = await syncAPI.getAllDeleted();
    const totalToSync = pendingData.totalPending + deletedData.sessions.length;

    const allSessions = [...pendingData.sessions, ...deletedData.sessions];

    // Simulate batch sync to server
    if (totalToSync > 0) {
      // Show spinner toast and store the ID
      const newToastId = toast(<Loader className="w-5 h-5 animate-spin" />, {
        duration: Infinity, // Keep it visible until we update it
        className: "!w-12 !h-12 !min-h-0 !p-2 flex items-center justify-center",
        unstyled: false,
      });
      setToastId(newToastId);

      // Store the data being synced so we can update it locally when sync completes
      const sessionIds = pendingData.sessions.map((s) => s.id!);
      setLastSyncedData({
        sessionIds,
        deletedSessionsCount: deletedData.sessions.length,
      });

      syncSessions(allSessions);
    } else {
      // No data to sync, no need to show any toast
    }
  };

  return (
    <div className="w-1/2 p-4 border-r hidden md:block">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Data View</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded text-xs ${
                viewMode === "table"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("json")}
              className={`px-3 py-1 rounded text-xs ${
                viewMode === "json"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              JSON
            </button>
          </div>
        </div>
        <div className="text-sm">
          <div className="mb-2">
            <strong>Sync Status:</strong>
          </div>
          {syncStatus && (
            <div className="space-y-1 text-xs">
              <div>Pending: {syncStatus.pending}</div>
              <div>Deleted: {syncStatus.deleted}</div>
              {/* Comment out the manual sync button - using auto-sync now */}

              {/* <button
                onClick={triggerSync}
                disabled={syncStatus.pending + syncStatus.deleted === 0}
                className={`px-2 py-1 rounded text-white ${
                  syncStatus.pending + syncStatus.deleted > 0
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Sync to Server ({syncStatus.pending + syncStatus.deleted})
              </button> */}

              <div className="text-blue-600 font-medium">
                {syncSessionsLoading
                  ? "Syncing..."
                  : `Next sync in: ${countdown}s`}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-full overflow-auto">
        {viewMode === "json" ? (
          <pre className="p-4 rounded-lg text-xs">
            {JSON.stringify(completeData, null, 2)}
          </pre>
        ) : (
          <div className="rounded-lg border">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Type</th>
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium">Parent</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {flattenedData.map((record) => (
                  <tr key={record.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          record.recordType === "session"
                            ? "bg-blue-100 text-blue-800"
                            : record.recordType === "exercise"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {record.recordType}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {record.displayName}
                    </td>
                    <td className="px-3 py-2 text-gray-600">
                      {record.parentInfo}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          record.syncStatus === "synced"
                            ? "bg-green-100 text-green-800"
                            : record.syncStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : record.syncStatus === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {record.syncStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-500">
                      {new Date(record.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {flattenedData.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No data yet. Create a session to get started!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataView;
