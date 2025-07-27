import { connectDB } from "@/lib/db";
import { UserResult } from "@/models/UserResult";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  await connectDB();

  const session_id = uuidv4();
  const user_md5 = "hardcoded_user_md5"; // TODO: Replace with actual user md5 from session

  const newSession = new UserResult({
    user_md5,
    session_id,
  });

  try {
    await newSession.save();
    return NextResponse.json({ session_id }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
