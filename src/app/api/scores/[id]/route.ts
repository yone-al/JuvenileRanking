import { NextRequest, NextResponse } from "next/server";
import { getScoreById, updateScore, deleteScore } from "@/lib/database";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid score ID" }, { status: 400 });
    }

    const score = await getScoreById(id);
    if (!score) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    return NextResponse.json(score);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch score" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid score ID" }, { status: 400 });
    }

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

    const updatedScore = await updateScore(
      id,
      name,
      game1,
      game2,
      game3,
      created_at,
    );
    if (!updatedScore) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    return NextResponse.json(updatedScore);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update score" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid score ID" }, { status: 400 });
    }

    const deleted = await deleteScore(id);
    if (!deleted) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Score deleted successfully" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to delete score" },
      { status: 500 },
    );
  }
}
