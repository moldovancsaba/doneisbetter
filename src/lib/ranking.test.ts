import { PersonalRankingSnapshot } from '../models/PersonalRankingSnapshot';
import { GlobalRanking } from '../models/GlobalRanking';

// Mock the models
jest.mock('../models/PersonalRankingSnapshot');
jest.mock('../models/GlobalRanking');

const calculateGlobalRankings = async () => {
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
};

describe('calculateGlobalRankings', () => {
    it('should calculate global rankings correctly', async () => {
        const mockSnapshots = [
            { _id: '1', ranking: ['card1', 'card2', 'card3'], contributedToGlobal: false },
            { _id: '2', ranking: ['card2', 'card1', 'card4'], contributedToGlobal: false },
        ];

        PersonalRankingSnapshot.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockSnapshots),
        });

        GlobalRanking.updateOne.mockResolvedValue({});
        PersonalRankingSnapshot.updateMany.mockResolvedValue({});

        await calculateGlobalRankings();

        expect(GlobalRanking.updateOne).toHaveBeenCalledWith(
            { cardId: 'card1' },
            expect.objectContaining({ $set: expect.objectContaining({ totalScore: 19 }) }),
            { upsert: true }
        );

        expect(GlobalRanking.updateOne).toHaveBeenCalledWith(
            { cardId: 'card2' },
            expect.objectContaining({ $set: expect.objectContaining({ totalScore: 19 }) }),
            { upsert: true }
        );

        expect(GlobalRanking.updateOne).toHaveBeenCalledWith(
            { cardId: 'card3' },
            expect.objectContaining({ $set: expect.objectContaining({ totalScore: 8 }) }),
            { upsert: true }
        );

        expect(GlobalRanking.updateOne).toHaveBeenCalledWith(
            { cardId: 'card4' },
            expect.objectContaining({ $set: expect.objectContaining({ totalScore: 8 }) }),
            { upsert: true }
        );

        expect(PersonalRankingSnapshot.updateMany).toHaveBeenCalledWith(
            { _id: { $in: ['1', '2'] } },
            { $set: { contributedToGlobal: true } }
        );
    });
});
