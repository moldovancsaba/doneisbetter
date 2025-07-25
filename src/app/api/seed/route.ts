import { connectDB } from "@/lib/db";
import { Card } from "@/models/Card";
import { NextResponse } from "next/server";
import crypto from "crypto";

const sampleCards = [
  {
    type: "text" as const,
    content: "Card 1",
    slug: "card-1",
  },
  {
    type: "text" as const,
    content: "Card 2",
    slug: "card-2",
  },
  {
    type: "text" as const,
    content: "Card 3",
    slug: "card-3",
  },
];

export async function GET() {
  await connectDB();

  try {
    await Card.deleteMany({});
    console.log("✅ Previous cards deleted");

    const cardsToInsert = sampleCards.map((card) => ({
      ...card,
      md5: crypto.createHash("md5").update(card.content).digest("hex"),
    }));

    await Card.insertMany(cardsToInsert);
    console.log("✅ Sample cards inserted");

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    return NextResponse.json(
      { error: "Error seeding database" },
      { status: 500 }
    );
  }
}
