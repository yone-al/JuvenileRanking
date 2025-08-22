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
    // totalを計算して追加
    return data.map(row => ({
      ...row,
      total: row.game1 + row.game2 + row.game3
    })) as ScoreData[];
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
      ORDER BY ("game1" + "game2" + "game3") DESC, "created_at" DESC
    `;
    // totalを計算して追加
    return data.map(row => ({
      ...row,
      total: row.game1 + row.game2 + row.game3
    })) as ScoreData[];
  } catch (error) {
    console.error("Database query failed:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to fetch data from database: ${error.message}`);
    } else {
      throw new Error("Failed to fetch data from database: Unknown error");
    }
  }
}

async function getScoreById(id: number): Promise<ScoreData | null> {
  try {
    const data = await sql`
      SELECT * FROM "scores" WHERE "id" = ${id}
    `;
    if (data.length > 0) {
      const row = data[0];
      return {
        ...row,
        total: row.game1 + row.game2 + row.game3
      } as ScoreData;
    }
    return null;
  } catch (error) {
    console.error("Database query failed:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch score by id: ${error.message}`);
    } else {
      throw new Error("Failed to fetch score by id: Unknown error");
    }
  }
}

async function addScore(
  name: string,
  game1: number,
  game2: number,
  game3: number,
  created_at?: string
): Promise<ScoreData> {
  try {
    const data = created_at
      ? await sql`
          INSERT INTO "scores" ("name", "game1", "game2", "game3", "created_at")
          VALUES (${name}, ${game1}, ${game2}, ${game3}, ${created_at}::timestamp)
          RETURNING *
        `
      : await sql`
          INSERT INTO "scores" ("name", "game1", "game2", "game3", "created_at")
          VALUES (${name}, ${game1}, ${game2}, ${game3}, NOW() AT TIME ZONE 'Asia/Tokyo')
          RETURNING *
        `;
    const row = data[0];
    return {
      ...row,
      total: row.game1 + row.game2 + row.game3
    } as ScoreData;
  } catch (error) {
    console.error("Database insert failed:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to add score: ${error.message}`);
    } else {
      throw new Error("Failed to add score: Unknown error");
    }
  }
}

async function updateScore(
  id: number,
  name: string,
  game1: number,
  game2: number,
  game3: number,
  created_at?: string
): Promise<ScoreData | null> {
  try {
    const data = created_at
      ? await sql`
          UPDATE "scores"
          SET "name" = ${name}, "game1" = ${game1}, "game2" = ${game2},
              "game3" = ${game3}, 
              "created_at" = ${created_at}::timestamp
          WHERE "id" = ${id}
          RETURNING *
        `
      : await sql`
          UPDATE "scores"
          SET "name" = ${name}, "game1" = ${game1}, "game2" = ${game2},
              "game3" = ${game3}
          WHERE "id" = ${id}
          RETURNING *
        `;
    if (data.length > 0) {
      const row = data[0];
      return {
        ...row,
        total: row.game1 + row.game2 + row.game3
      } as ScoreData;
    }
    return null;
  } catch (error) {
    console.error("Database update failed:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update score: ${error.message}`);
    } else {
      throw new Error("Failed to update score: Unknown error");
    }
  }
}

async function deleteScore(id: number): Promise<boolean> {
  try {
    const data = await sql`
      DELETE FROM "scores" WHERE "id" = ${id}
      RETURNING "id"
    `;
    return data.length > 0;
  } catch (error) {
    console.error("Database delete failed:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete score: ${error.message}`);
    } else {
      throw new Error("Failed to delete score: Unknown error");
    }
  }
}

export {
  getAllData,
  getAllDataByTotal,
  getScoreById,
  addScore,
  updateScore,
  deleteScore,
};
