import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { sessionId, userId, cardA, cardB, winner } = await request.json();
  // TODO: Implement logic to record the vote
  console.log("Recording vote:", { sessionId, userId, cardA, cardB, winner });
  return NextResponse.json({ status: "ok" });
}
