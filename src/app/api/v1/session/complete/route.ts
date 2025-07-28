import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Session } from '@/models/Session';
import { PersonalRankingSnapshot } from '@/models/PersonalRankingSnapshot';
import { GlobalRanking } from '@/models/GlobalRanking';

async function calculateGlobalRankings() {
    const recentSessions = await PersonalRankingSnapshot.find({ contributedToGlobal: false })
        .sort({ completedAt: -1 })
        .limit(100)
        .lean();

    const rankingPoints: { [key: string]: { totalScore: number, appearanceCount: number, ranks: number[] } } = {};

    for (const session of recentSessions) {
        for (let i = 0; i < session.ranking.length; i++) {
            const cardId = session.ranking[i];
            const points = 10 - i;
            if (!rankingPoints[cardId]) {
                rankingPoints[cardId] = {
                    totalScore: 0,
                    appearanceCount: 0,
                    ranks: [],
                };
            }
            rankingPoints[cardId].totalScore += points;
            rankingPoints[cardId].appearanceCount++;
            rankingPoints[cardId].ranks.push(i + 1);
        }
    }

    for (const cardId in rankingPoints) {
        const { totalScore, appearanceCount, ranks } = rankingPoints[cardId];
        const averageRank = ranks.reduce((a, b) => a + b, 0) / ranks.length;
        await GlobalRanking.updateOne(
            { cardId },
            {
                $set: {
                    totalScore,
                    appearanceCount,
                    averageRank,
                    lastUpdated: new Date(),
                }
            },
            { upsert: true }
        );
    }

    await PersonalRankingSnapshot.updateMany(
        { _id: { $in: recentSessions.map(s => s._id) } },
        { $set: { contributedToGlobal: true } }
    );
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { sessionId } = body;

    const session = await Session.findOne({ sessionId });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();

    const snapshot = new PersonalRankingSnapshot({
        sessionId: session.sessionId,
        ranking: session.personalRanking.slice(0, 10),
        completedAt: new Date(),
    });
    await snapshot.save();

    await calculateGlobalRankings();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
