import { connectDB } from "@/lib/db";
import { Card } from "@/models/Card";
import { NextRequest, NextResponse } from "next/server";

// GET /api/cards/[md5] → returns a card by its md5
export async function GET(
  req: NextRequest,
  { params }: { params: { md5: string } }
) {
  await connectDB();
  const card = await Card.findOne({ md5: params.md5 });
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }
  return NextResponse.json(card);
}

// PUT /api/cards/[md5] → updates a card
export async function PUT(
  req: NextRequest,
  { params }: { params: { md5: string } }
) {
  await connectDB();
  const body = await req.json();
  const updatedCard = await Card.findOneAndUpdate({ md5: params.md5 }, body, {
    new: true,
  });
  if (!updatedCard) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }
  return NextResponse.json(updatedCard);
}

// DELETE /api/cards/[md5] → deletes a card
export async function DELETE(
  req: NextRequest,
  { params }: { params: { md5: string } }
) {
  await connectDB();
  const deletedCard = await Card.findOneAndDelete({ md5: params.md5 });
  if (!deletedCard) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Card deleted successfully" });
}
