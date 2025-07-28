import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Card } from '@/models/Card';
import { CreateCardSchema } from '@/lib/zod/schemas';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    await connectDB();

    const cards = await Card.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(cards);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { success, data } = CreateCardSchema.safeParse(body);

    if (!success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { type, content, title, tags } = data;

    const card = new Card({
      uuid: uuidv4(),
      type,
      content,
      title,
      tags,
    });

    await card.save();

    return NextResponse.json(card, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
