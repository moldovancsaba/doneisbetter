import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Session } from '@/models/Session';
import { GlobalRanking } from '@/models/GlobalRanking';
import { PersonalRankingSnapshot } from '@/models/PersonalRankingSnapshot';

async function calculateGlobalRankings() {
    const recentSessions = await PersonalRankingSnapshot.find({ contributedToGlobal: false })
        .sort({ completedAt: -1 })
        .limit(100)
        .lean();

    const rankingPoints = {};

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


export async function POST() {
  try {
    await connectDB();

    await calculateGlobalRankings();

    const rankings = await GlobalRanking.find({})
      .sort({ totalScore: -1 })
      .limit(100)
      .lean();

    return NextResponse.json(rankings);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
