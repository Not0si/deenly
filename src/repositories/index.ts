import { type SQLiteDatabase } from "expo-sqlite"

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  )

  let currentDbVersion = result?.user_version ?? 0

  if (currentDbVersion >= DATABASE_VERSION) {
    return
  }

  switch (currentDbVersion) {
    case 0: {
      await migrateV1(db)

      currentDbVersion = 1
      await db.execAsync(`PRAGMA user_version = ${currentDbVersion}`)
    }

    default:
      break
  }
}

async function migrateV1(db: SQLiteDatabase) {
  //
  await db.execAsync(`
  PRAGMA journal_mode = 'wal';
  
  -- Parent Table: DayCount
  CREATE TABLE day_counts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      description TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
  );

  -- Child Table: DayCountEvent
  CREATE TABLE day_count_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_count_id INTEGER NOT NULL,
      title VARCHAR(255) NULL,
      description TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      occured_at DATETIME NOT NULL,
      
      -- Foreign Key Constraint linking child to parent
      CONSTRAINT fk_day_count
          FOREIGN KEY (day_count_id) 
          REFERENCES day_counts (id) 
          ON DELETE CASCADE
  );

  -- Index to optimize querying events by day_count_id
  CREATE INDEX idx_day_count_events_day_count_id 
  ON day_count_events (day_count_id);
  
  
        `)

  //await db.runAsync(
  //  "INSERT INTO todos (value, intValue) VALUES (?, ?)",
  //  "hello",
  //  1
  // )

  //await db.runAsync(
  //   "INSERT INTO todos (value, intValue) VALUES (?, ?)",
  //   "world",
  //   2
  // )
}

//
export interface PaginationParams {
  page?: number // 1-based page index (default: 1)
  limit?: number // Number of items per page (default: 20)
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
