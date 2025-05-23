import dbConnect from '../../../lib/dbConnect';
import VoteRank from '../../../models/VoteRank';
import VotePair from '../../../models/VotePair';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Get all rankings, sorted by rank
    const rankings = await VoteRank.find()
      .sort({ rank: 1 })
      .populate('cardId')
      .lean();
    
    // Get global statistics
    const totalVotes = await VotePair.countDocuments();
    
    // Transform the data for easier frontend consumption
    const formattedRankings = rankings.map(ranking => {
      // Calculate win rate as a percentage and round to nearest integer
      const winRate = ranking.totalVotes > 0 
        ? Math.round((ranking.wins / ranking.totalVotes) * 100) 
        : 0;
        
      return {
        _id: ranking.cardId._id,
        cardText: ranking.cardId.text,
        rank: ranking.rank,
        wins: ranking.wins,
        totalVotes: ranking.totalVotes,
        winRate: winRate,
        lastUpdated: ranking.lastUpdated || ranking.cardId.updatedAt || ranking.cardId.createdAt,
        createdAt: ranking.cardId.createdAt
      };
    });
    
    return res.status(200).json({
      success: true,
      data: formattedRankings,
      meta: {
        totalCards: rankings.length,
        totalVotes: totalVotes,
        averageVotesPerCard: rankings.length > 0 ? Math.round(totalVotes / rankings.length) : 0,
        lastUpdated: new Date()
      }
    });
    
  } catch (error) {
    console.error('Error getting rankings:', error);
    return res.status(500).json({ success: false, error: 'Failed to get rankings' });
  }
}

