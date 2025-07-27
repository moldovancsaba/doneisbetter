import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Implement logic to fetch rankings
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const { newRankedCards } = await request.json();
  // TODO: Implement logic to save the new rankings
  console.log("Saving new rankings:", newRankedCards);
  return NextResponse.json({ status: "ok" });
}
