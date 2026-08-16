import { type SQLiteDatabase } from "expo-sqlite"
import { PaginatedResult, PaginationParams } from "."
//
export interface DayCount {
  id: number
  name: string
  description: string | null
  created_at: string
}

export interface DayCountEvent {
  id: number
  day_count_id: number
  title: string | null
  description: string | null
  created_at: string
  occured_at: string
}

export interface CreateDayCountInput {
  name: string
  description?: string
}

export interface CreateDayCountEventInput {
  day_count_id: number
  title?: string
  description?: string
  occured_at: string // ISO string format
}

//

export const dayCountRepository = {
  // Fetch all day counts
  getDayCounts: async (
    db: SQLiteDatabase,
    { page = 1, limit = 20 }: PaginationParams = {}
  ): Promise<PaginatedResult<DayCount>> => {
    const offset = (page - 1) * limit

    const [data, countResult] = await Promise.all([
      db.getAllAsync<DayCount>(
        "SELECT * FROM day_counts ORDER BY created_at DESC LIMIT $limit OFFSET $offset",
        { $limit: limit, $offset: offset }
      ),
      db.getFirstAsync<{ total: number }>(
        "SELECT COUNT(*) AS total FROM day_counts"
      ),
    ])

    const total = countResult?.total ?? 0

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Fetch a single day count by ID
  getDayCountById: async (
    db: SQLiteDatabase,
    id: number
  ): Promise<DayCount | null> => {
    return await db.getFirstAsync<DayCount>(
      "SELECT * FROM day_counts WHERE id = $id",
      { $id: id }
    )
  },

  // Insert a new day count
  insertDayCount: async (
    db: SQLiteDatabase,
    input: CreateDayCountInput
  ): Promise<number> => {
    const statement = await db.prepareAsync(
      "INSERT INTO day_counts (name, description) VALUES ($name, $description)"
    )

    try {
      const result = await statement.executeAsync({
        $name: input.name,
        $description: input.description ?? null,
      })
      return result.lastInsertRowId
    } finally {
      await statement.finalizeAsync()
    }
  },

  // Delete a day count (cascades to events)
  deleteDayCount: async (db: SQLiteDatabase, id: number): Promise<void> => {
    const statement = await db.prepareAsync(
      "DELETE FROM day_counts WHERE id = $id"
    )

    try {
      await statement.executeAsync({ $id: id })
    } finally {
      await statement.finalizeAsync()
    }
  },
}

export const dayCountEventRepository = {
  // Fetch all events for a specific day count
  getEventsByDayCountId: async (
    db: SQLiteDatabase,
    dayCountId: number,
    { page = 1, limit = 20 }: PaginationParams = {}
  ): Promise<PaginatedResult<DayCountEvent>> => {
    const offset = (page - 1) * limit

    const [data, countResult] = await Promise.all([
      db.getAllAsync<DayCountEvent>(
        "SELECT * FROM day_count_events WHERE day_count_id = $dayCountId ORDER BY occured_at DESC LIMIT $limit OFFSET $offset",
        {
          $dayCountId: dayCountId,
          $limit: limit,
          $offset: offset,
        }
      ),
      db.getFirstAsync<{ total: number }>(
        "SELECT COUNT(*) AS total FROM day_count_events WHERE day_count_id = $dayCountId",
        { $dayCountId: dayCountId }
      ),
    ])

    const total = countResult?.total ?? 0

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Insert a new event linked to a day count
  insertEvent: async (
    db: SQLiteDatabase,
    input: CreateDayCountEventInput
  ): Promise<number> => {
    const statement = await db.prepareAsync(
      "INSERT INTO day_count_events (day_count_id, title, description, occured_at) VALUES ($day_count_id, $title, $description, $occured_at)"
    )

    try {
      const result = await statement.executeAsync({
        $day_count_id: input.day_count_id,
        $title: input.title ?? null,
        $description: input.description ?? null,
        $occured_at: input.occured_at,
      })
      return result.lastInsertRowId
    } finally {
      await statement.finalizeAsync()
    }
  },

  // Delete a specific event
  deleteEvent: async (db: SQLiteDatabase, id: number): Promise<void> => {
    const statement = await db.prepareAsync(
      "DELETE FROM day_count_events WHERE id = $id"
    )

    try {
      await statement.executeAsync({ $id: id })
    } finally {
      await statement.finalizeAsync()
    }
  },
}
