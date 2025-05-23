import dbConnect from '../../../lib/dbConnect';
import VoteRank from '../../../models/VoteRank';

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
    
    // Transform the data for easier frontend consumption
    const formattedRankings = rankings.map(ranking => ({
      card: ranking.cardId,
      rank: ranking.rank,
      wins: ranking.wins,
      totalVotes: ranking.totalVotes,
      winRate: ranking.totalVotes > 0 ? (ranking.wins / ranking.totalVotes) * 100 : 0,
      lastUpdated: ranking.lastUpdated
    }));
    
    return res.status(200).json({
      success: true,
      data: formattedRankings
    });
    
  } catch (error) {
    console.error('Error getting rankings:', error);
    return res.status(500).json({ success: false, error: 'Failed to get rankings' });
  }
}

