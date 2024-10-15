import { NextResponse } from "next/server";
import {
  getFilteredThoughts,
  submitThought,
  voteThought,
} from "@/lib/thoughts";
import { Thought } from "@/types/thought";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") as "hot" | "new" | "top" | null;

  try {
    const thoughts = await getFilteredThoughts(filter || "new");
    return NextResponse.json(thoughts);
  } catch (error) {
    console.error("Error in GET /api/thoughts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const thought = await request.json();
    await submitThought(thought);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/thoughts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, voteType, previousVote } = await request.json();
    await voteThought(id, voteType, previousVote);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in PUT /api/thoughts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
