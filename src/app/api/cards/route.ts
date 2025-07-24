import { connectDB } from "@/lib/db";
import { Card } from "@/models/Card";
import { NextRequest, NextResponse } from "next/server";

// GET /api/cards → returns all cards
export async function GET() {
  await connectDB();
  const cards = await Card.find().sort({ createdAt: -1 });
  return NextResponse.json(cards);
}

// POST /api/cards → create cards from multiple URLs
export async function POST(req: NextRequest) {
  await connectDB();
  const { urls } = await req.json();
  if (!Array.isArray(urls)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const created = await Card.insertMany(urls.map((url) => ({ url })));
  return NextResponse.json(created);
}
