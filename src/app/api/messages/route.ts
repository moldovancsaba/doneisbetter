import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';

export async function POST(req: Request) {
  console.log('POST /api/messages - Starting');
  try {
    await connectDB();
    console.log('POST /api/messages - Connected to MongoDB');
    
    const { content } = await req.json();
    console.log('POST /api/messages - Received content:', content);
    
    if (!content?.trim()) {
      console.log('POST /api/messages - Empty content received');
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const message = await Message.create({ content: content.trim() });
    console.log('POST /api/messages - Message created:', message);
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('POST /api/messages - Error:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log('GET /api/messages - Starting');
  try {
    await connectDB();
    console.log('GET /api/messages - Connected to MongoDB');
    
    const messages = await Message.find().sort({ createdAt: -1 });
    console.log('GET /api/messages - Found messages:', messages.length);
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('GET /api/messages - Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
