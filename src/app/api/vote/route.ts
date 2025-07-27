import { connectDB } from "@/lib/db";
import { UserResult } from "@/models/UserResult";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDB();
  const { session_id, left_card_id, right_card_id, winner } = await request.json();

  if (!session_id || !left_card_id || !right_card_id || !winner) {
    return NextResponse.json(
      { error: "Missing required fields: session_id, left_card_id, right_card_id, winner" },
      { status: 400 }
    );
  }

  const update = {
    $push: {
      vote_log: {
        left_card_id,
        right_card_id,
        winner,
        timestamp: new Date(),
      },
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
