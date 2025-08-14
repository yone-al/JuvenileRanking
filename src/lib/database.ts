"use server";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}
const sql = neon(databaseUrl);

export type ScoreData = {
  id: number;
  created_at: Date;
  name: string;
  game1: number;
  game2: number;
  game3: number;
  total: number;
};

async function getAllData(): Promise<ScoreData[]> {
  try {
    const data = await sql`
      SELECT * FROM "scores"
    `;
    return data as ScoreData[];
  } catch (error) {
    console.error("Database query failed:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to fetch data from database: ${error.message}`);
    } else {
      throw new Error("Failed to fetch data from database: Unknown error");
    }
  }
}

async function getAllDataByTotal(): Promise<ScoreData[]> {
  try {
    const data = await sql`
      SELECT * FROM "scores"
      ORDER BY "total" DESC
    `;
    return data as ScoreData[];
  } catch (error) {
    console.error("Database query failed:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to fetch data from database: ${error.message}`);
    } else {
      throw new Error("Failed to fetch data from database: Unknown error");
    }
  }
}

export { getAllData, getAllDataByTotal };
