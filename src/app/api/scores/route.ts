import { NextRequest, NextResponse } from "next/server";
import { getAllDataByTotal, addScore } from "@/lib/database";

export async function GET() {
  try {
    const scores = await getAllDataByTotal();
    return NextResponse.json(scores);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scores" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, game1, game2, game3, created_at } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Name is required and must be a string" },
        { status: 400 },
      );
    }

    if (
      typeof game1 !== "number" ||
      typeof game2 !== "number" ||
      typeof game3 !== "number"
    ) {
      return NextResponse.json(
        { error: "Game scores must be numbers" },
        { status: 400 },
      );
    }

    if (created_at && typeof created_at !== "string") {
      return NextResponse.json(
        { error: "created_at must be a valid date string" },
        { status: 400 },
      );
    }

    const newScore = await addScore(name, game1, game2, game3, created_at);
    return NextResponse.json(newScore, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to add score" }, { status: 500 });
  }
}
