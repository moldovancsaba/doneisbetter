import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Session } from '@/models/Session';

export async function GET(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    await connectDB();

    const { sessionId } = params;

    const session = await Session.findOne({ sessionId }).lean();

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(session);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
