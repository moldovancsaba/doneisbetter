import { connectDB } from "@/lib/db";
import { UserResult } from "@/models/UserResult";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json(
      { error: "Missing required field: session_id" },
      { status: 400 }
    );
  }

  const userResult = await UserResult.findOne({ session_id });

  if (!userResult) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(userResult.final_ranking);
}

export async function PUT(request: Request) {
  await connectDB();
  const { session_id, final_ranking } = await request.json();

  if (!session_id || !final_ranking) {
    return NextResponse.json(
      { error: "Missing required fields: session_id, final_ranking" },
      { status: 400 }
    );
  }

  const update = {
    $set: {
      final_ranking,
      completed_at: new Date(),
    },
  };

  const updatedResult = await UserResult.findOneAndUpdate({ session_id }, update, {
    new: true,
  });

  if (!updatedResult) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(updatedResult);
}
