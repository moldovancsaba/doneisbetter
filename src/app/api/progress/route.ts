import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Implement logic to fetch user's progress
  return NextResponse.json({ seenCards: [] });
}
