import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Card } from '@/models/Card';
import { CreateCardSchema } from '@/lib/zod/schemas';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    await connectDB();

    const { cardId } = await params;
    const body = await req.json();
    const { success, data } = CreateCardSchema.partial().safeParse(body);

    if (!success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const card = await Card.findOneAndUpdate(
      { uuid: cardId },
      { ...data, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // TODO: Trigger global ranking recalculation

    return NextResponse.json(card);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    await connectDB();

    const { cardId } = await params;

    const card = await Card.findOneAndDelete({ uuid: cardId }).lean();

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // TODO: Remove from all historical data, recalculate rankings

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
