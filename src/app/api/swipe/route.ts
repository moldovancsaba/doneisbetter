import { connectDB } from "@/lib/db";
import { UserResult } from "@/models/UserResult";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDB();
  const { session_id, card_id, action } = await request.json();

  if (!session_id || !card_id || !action) {
    return NextResponse.json(
      { error: "Missing required fields: session_id, card_id, action" },
      { status: 400 }
    );
  }

  const update = {
    $push: {
      swipe_log: {
        card_id,
        action,
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
