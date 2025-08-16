import Dexie, { Table } from "dexie";

// Sync status enum
export type SyncStatus = "pending" | "synced" | "error" | "deleted";

// Define the database schema interfaces
export interface TrainingSession {
  id?: string;
  name: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  syncError?: string;
}

// Define the database class
class TrainingDatabase extends Dexie {
  sessions!: Table<TrainingSession>;

  constructor() {
    super("physiq-training-test");
    this.version(1).stores({
      sessions: "id,name,date,createdAt,updatedAt,syncStatus",
    });
  }
}

// Create and export the database instance
export const db = new TrainingDatabase();

// Sessions API
export const sessionsAPI = {
  getAll: () => db.sessions.toArray(),

  getPendingSync: () =>
    db.sessions.where("syncStatus").anyOf(["pending", "error"]).toArray(),

  add: (
    session: Omit<
      TrainingSession,
      "id" | "createdAt" | "updatedAt" | "syncStatus"
    >
  ) => {
    const now = new Date().toISOString();
    const newSession = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      syncStatus: "pending" as SyncStatus,
      ...session,
    };
    return db.sessions.add(newSession);
  },

  update: (id: string, changes: Partial<TrainingSession>) => {
    const updateData = {
      ...changes,
      updatedAt: new Date().toISOString(),
      syncStatus: "pending" as SyncStatus,
    };
    return db.sessions.update(id, updateData);
  },

  markSynced: (id: string) =>
    db.sessions.update(id, { syncStatus: "synced" as SyncStatus }),

  markSyncError: (id: string, error: string) =>
    db.sessions.update(id, {
      syncStatus: "error" as SyncStatus,
      syncError: error,
    }),

  delete: async (id: string) => {
    // Mark for deletion instead of actually deleting (for sync)
    await db.sessions.update(id, {
      syncStatus: "deleted" as SyncStatus,
      updatedAt: new Date().toISOString(),
    });

    // Mark related exercises and sets for deletion too
    // const exercises = await db.exercises
    //   .where("sessionId")
    //   .equals(id)
    //   .toArray();
    // for (const exercise of exercises) {
    //   await exercisesAPI.delete(exercise.id!);
    // }
  },

  hardDelete: async (id: string) => {
    // Actually delete from local DB (used after successful server sync)
    return db.sessions.delete(id);
  },

  clear: () => db.sessions.clear(),
};

// Sync utility functions
export const syncAPI = {
  // Get all records that need to be synced to server
  getAllPendingSync: async () => {
    const [sessions] = await Promise.all([sessionsAPI.getPendingSync()]);

    return {
      sessions,
      totalPending: sessions.length,
    };
  },

  // Get all records marked for deletion
  getAllDeleted: async () => {
    const [sessions] = await Promise.all([
      db.sessions.where("syncStatus").equals("deleted").toArray(),
    ]);

    return { sessions };
  },

  // Mark records as synced after successful server update
  markBatchSynced: async (recordIds: {
    sessionIds?: string[];
    exerciseIds?: string[];
    setIds?: string[];
  }) => {
    const promises = [];

    if (recordIds.sessionIds?.length) {
      promises.push(
        ...recordIds.sessionIds.map((id) => sessionsAPI.markSynced(id))
      );
    }

    await Promise.all(promises);
  },

  // Clean up successfully synced deletions
  cleanupSyncedDeletions: async () => {
    const deleted = await syncAPI.getAllDeleted();
    const promises: Promise<any>[] = [];

    deleted.sessions.forEach((session) => {
      if (session.syncStatus === "deleted") {
        promises.push(sessionsAPI.hardDelete(session.id!));
      }
    });

    await Promise.all(promises);
  },

  // Get sync status summary
  getSyncStatusSummary: async () => {
    const pending = await syncAPI.getAllPendingSync();
    const deleted = await syncAPI.getAllDeleted();

    return {
      pending: pending.totalPending,
      deleted: deleted.sessions.length,
      lastSyncAttempt: localStorage.getItem("lastSyncAttempt"),
      lastSuccessfulSync: localStorage.getItem("lastSuccessfulSync"),
    };
  },
};

// Export the database for direct access if needed
export default db;
