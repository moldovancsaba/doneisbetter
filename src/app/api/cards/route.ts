import { connectDB } from "@/lib/db";
import { Card } from "@/models/Card";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// GET /api/cards → returns all cards or a single card by md5
export async function GET(req: NextRequest) {
  await connectDB();
  const md5 = req.nextUrl.searchParams.get("md5");
  console.log("Fetching card with md5:", md5);

  if (md5) {
    const card = await Card.findOne({ md5 });
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }
    return NextResponse.json(card);
  } else {
    const cards = await Card.find().sort({ createdAt: -1 });
    return NextResponse.json(cards);
  }
}

// POST /api/cards → create a new card
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const { type, content, slug, ...rest } = body;

  if (!type || !content || !slug) {
    return NextResponse.json(
      { error: "Missing required fields: type, content, slug" },
      { status: 400 }
    );
  }

  const md5 = crypto.createHash("md5").update(content).digest("hex");

  const newCard = new Card({
    md5,
    slug,
    type,
    content,
    ...rest,
  });

  try {
    await newCard.save();
    return NextResponse.json(newCard, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Check if it's a duplicate key error
      if ('code' in error && error.code === 11000) {
        return NextResponse.json(
          { error: "A card with this md5 or slug already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}

// PUT /api/cards → updates a card
export async function PUT(req: NextRequest) {
  await connectDB();
  const md5 = req.nextUrl.searchParams.get("md5");
  if (!md5) {
    return NextResponse.json({ error: "Missing md5 parameter" }, { status: 400 });
  }

  const body = await req.json();
  const updatedCard = await Card.findOneAndUpdate({ md5 }, body, {
    new: true,
  });
  if (!updatedCard) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }
  return NextResponse.json(updatedCard);
}

// DELETE /api/cards → deletes a card
export async function DELETE(req: NextRequest) {
  await connectDB();
  const md5 = req.nextUrl.searchParams.get("md5");
  console.log("Deleting card with md5:", md5);
  if (!md5) {
    return NextResponse.json({ error: "Missing md5 parameter" }, { status: 400 });
  }

  const deletedCard = await Card.findOneAndDelete({ md5 });
  if (!deletedCard) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Card deleted successfully" });
}
