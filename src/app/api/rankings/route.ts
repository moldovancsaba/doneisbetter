import { connectDB } from "@/lib/db";
import { Card } from "@/models/Card";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const rankedCards = await Card.find({ ranking: { $ne: null } }).sort({ ranking: 1 });
  return NextResponse.json(rankedCards);
}

export async function POST(request: Request) {
  await connectDB();
  const { newRankedCards } = await request.json();
  // TODO: Implement logic to save the new rankings
  console.log("Saving new rankings:", newRankedCards);
  return NextResponse.json({ status: "ok" });
}
