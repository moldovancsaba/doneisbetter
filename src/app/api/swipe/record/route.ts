import { connectDB } from "@/lib/db";
import { Card } from "@/models/Card";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDB();
  const { cardId, direction } = await request.json();

  const swipeValue = direction === "right" ? 1 : 0;
  const update = {
    $set: {
      swipe: swipeValue,
      lastUpdated: new Date(),
    },
    $push: {
      swipeTimestamps: new Date(),
    },
    $inc: {
      [direction === "right" ? "likes" : "dislikes"]: 1,
    },
  };

  const updatedCard = await Card.findOneAndUpdate({ md5: cardId }, update, {
    new: true,
  });

  if (!updatedCard) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json(updatedCard);
}
