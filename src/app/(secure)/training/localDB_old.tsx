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

export interface Exercise {
  id?: string;
  sessionId: string;
  name: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  syncError?: string;
}

export interface ExerciseSet {
  id?: string;
  exerciseId: string;
  reps: number;
  weight: number;
  restTime?: number; // in seconds
  notes?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  syncError?: string;
}

// Define the database class
class TrainingDatabase extends Dexie {
  sessions!: Table<TrainingSession>;
  exercises!: Table<Exercise>;
  sets!: Table<ExerciseSet>;

  constructor() {
    super("physiq-training");
    this.version(2).stores({
      sessions: "id,name,date,createdAt,updatedAt,syncStatus",
      exercises: "id,sessionId,name,createdAt,updatedAt,syncStatus",
      sets: "id,exerciseId,reps,weight,createdAt,updatedAt,syncStatus",
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
    const exercises = await db.exercises
      .where("sessionId")
      .equals(id)
      .toArray();
    for (const exercise of exercises) {
      await exercisesAPI.delete(exercise.id!);
    }
  },

  hardDelete: async (id: string) => {
    // Actually delete from local DB (used after successful server sync)
    const exercises = await db.exercises
      .where("sessionId")
      .equals(id)
      .toArray();
    for (const exercise of exercises) {
      await db.sets.where("exerciseId").equals(exercise.id!).delete();
    }
    await db.exercises.where("sessionId").equals(id).delete();
    return db.sessions.delete(id);
  },

  clear: () => db.sessions.clear(),
};

// Exercises API
export const exercisesAPI = {
  getAll: () => db.exercises.toArray(),

  getPendingSync: () =>
    db.exercises.where("syncStatus").anyOf(["pending", "error"]).toArray(),

  getBySession: (sessionId: string) =>
    db.exercises.where("sessionId").equals(sessionId).toArray(),

  add: (
    exercise: Omit<Exercise, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ) => {
    const now = new Date().toISOString();
    const newExercise = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      syncStatus: "pending" as SyncStatus,
      ...exercise,
    };
    return db.exercises.add(newExercise);
  },

  update: (id: string, changes: Partial<Exercise>) => {
    const updateData = {
      ...changes,
      updatedAt: new Date().toISOString(),
      syncStatus: "pending" as SyncStatus,
    };
    return db.exercises.update(id, updateData);
  },

  markSynced: (id: string) =>
    db.exercises.update(id, { syncStatus: "synced" as SyncStatus }),

  markSyncError: (id: string, error: string) =>
    db.exercises.update(id, {
      syncStatus: "error" as SyncStatus,
      syncError: error,
    }),

  delete: async (id: string) => {
    // Mark for deletion instead of actually deleting
    await db.exercises.update(id, {
      syncStatus: "deleted" as SyncStatus,
      updatedAt: new Date().toISOString(),
    });

    // Mark related sets for deletion too
    const sets = await db.sets.where("exerciseId").equals(id).toArray();
    for (const set of sets) {
      await setsAPI.delete(set.id!);
    }
  },

  hardDelete: async (id: string) => {
    // Actually delete from local DB (used after successful server sync)
    await db.sets.where("exerciseId").equals(id).delete();
    return db.exercises.delete(id);
  },

  clear: () => db.exercises.clear(),
};

// Sets API
export const setsAPI = {
  getAll: () => db.sets.toArray(),

  getPendingSync: () =>
    db.sets.where("syncStatus").anyOf(["pending", "error"]).toArray(),

  getByExercise: (exerciseId: string) =>
    db.sets.where("exerciseId").equals(exerciseId).toArray(),

  add: (
    set: Omit<ExerciseSet, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ) => {
    const now = new Date().toISOString();
    const newSet = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      syncStatus: "pending" as SyncStatus,
      ...set,
    };
    return db.sets.add(newSet);
  },

  update: (id: string, changes: Partial<ExerciseSet>) => {
    const updateData = {
      ...changes,
      updatedAt: new Date().toISOString(),
      syncStatus: "pending" as SyncStatus,
    };
    return db.sets.update(id, updateData);
  },

  markSynced: (id: string) =>
    db.sets.update(id, { syncStatus: "synced" as SyncStatus }),

  markSyncError: (id: string, error: string) =>
    db.sets.update(id, { syncStatus: "error" as SyncStatus, syncError: error }),

  delete: (id: string) =>
    db.sets.update(id, {
      syncStatus: "deleted" as SyncStatus,
      updatedAt: new Date().toISOString(),
    }),

  hardDelete: (id: string) => db.sets.delete(id),

  clear: () => db.sets.clear(),
};

// Utility function to get complete session data with nested exercises and sets
export const getCompleteSessionData = async () => {
  const sessions = await db.sessions
    .where("syncStatus")
    .notEqual("deleted")
    .toArray();
  const exercises = await db.exercises
    .where("syncStatus")
    .notEqual("deleted")
    .toArray();
  const sets = await db.sets.where("syncStatus").notEqual("deleted").toArray();

  return sessions.map((session) => ({
    ...session,
    exercises: exercises
      .filter((exercise) => exercise.sessionId === session.id)
      .map((exercise) => ({
        ...exercise,
        sets: sets.filter((set) => set.exerciseId === exercise.id),
      })),
  }));
};

// Utility function to get flattened data with record types for sync monitoring
export const getFlattenedDataWithTypes = async () => {
  const sessions = await db.sessions.toArray();
  const exercises = await db.exercises.toArray();
  const sets = await db.sets.toArray();

  const flattenedData = [
    ...sessions.map((session) => ({
      ...session,
      recordType: "session" as const,
      displayName: session.name,
      parentInfo: session.date,
    })),
    ...exercises.map((exercise) => ({
      ...exercise,
      recordType: "exercise" as const,
      displayName: exercise.name,
      parentInfo: `Session: ${
        sessions.find((s) => s.id === exercise.sessionId)?.name || "Unknown"
      }`,
    })),
    ...sets.map((set) => ({
      ...set,
      recordType: "set" as const,
      displayName: `${set.reps} reps @ ${set.weight} lbs`,
      parentInfo: `Exercise: ${
        exercises.find((e) => e.id === set.exerciseId)?.name || "Unknown"
      }`,
    })),
  ];

  // Sort by creation time
  return flattenedData.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

// Sync utility functions
export const syncAPI = {
  // Get all records that need to be synced to server
  getAllPendingSync: async () => {
    const [sessions, exercises, sets] = await Promise.all([
      sessionsAPI.getPendingSync(),
      exercisesAPI.getPendingSync(),
      setsAPI.getPendingSync(),
    ]);

    return {
      sessions,
      exercises,
      sets,
      totalPending: sessions.length + exercises.length + sets.length,
    };
  },

  // Get all records marked for deletion
  getAllDeleted: async () => {
    const [sessions, exercises, sets] = await Promise.all([
      db.sessions.where("syncStatus").equals("deleted").toArray(),
      db.exercises.where("syncStatus").equals("deleted").toArray(),
      db.sets.where("syncStatus").equals("deleted").toArray(),
    ]);

    return { sessions, exercises, sets };
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

    if (recordIds.exerciseIds?.length) {
      promises.push(
        ...recordIds.exerciseIds.map((id) => exercisesAPI.markSynced(id))
      );
    }

    if (recordIds.setIds?.length) {
      promises.push(...recordIds.setIds.map((id) => setsAPI.markSynced(id)));
    }

    await Promise.all(promises);
  },

  // Clean up successfully synced deletions
  cleanupSyncedDeletions: async () => {
    const deleted = await syncAPI.getAllDeleted();
    const promises: Promise<any>[] = [];

    deleted.sets.forEach((set) => {
      if (set.syncStatus === "deleted") {
        promises.push(setsAPI.hardDelete(set.id!));
      }
    });

    deleted.exercises.forEach((exercise) => {
      if (exercise.syncStatus === "deleted") {
        promises.push(exercisesAPI.hardDelete(exercise.id!));
      }
    });

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
      deleted:
        deleted.sessions.length +
        deleted.exercises.length +
        deleted.sets.length,
      lastSyncAttempt: localStorage.getItem("lastSyncAttempt"),
      lastSuccessfulSync: localStorage.getItem("lastSuccessfulSync"),
    };
  },
};

// Export the database for direct access if needed
export default db;
