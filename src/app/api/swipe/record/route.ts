import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { cardId, direction } = await request.json();
  // TODO: Implement logic to record the swipe
  console.log(`Swiped ${direction} on card ${cardId}`);
  return NextResponse.json({ status: "ok" });
}
