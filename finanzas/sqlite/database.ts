import { SQLiteDatabase } from "expo-sqlite";

export async function setupDatabase(database: SQLiteDatabase) {
  await database.execAsync([
    {
      sql: `
        CREATE TABLE IF NOT EXISTS cards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bank TEXT NOT NULL,
          name TEXT NOT NULL,
          ending TEXT NOT NULL,
          expiration TEXT NOT NULL,
          color TEXT NOT NULL,
          type TEXT NOT NULL,
          issuer TEXT NOT NULL
        );
      `,
      args: [],
    },
  ]);
}
