import dbConnect from "../../../lib/dbConnect";
import Card from "../../../models/Card";
import VoteRank from "../../../models/VoteRank";
import VotePair from "../../../models/VotePair";

export default async function handler(req, res) {
  const requestTime = new Date().toISOString();
  console.log(`[${requestTime}] Debug votes request received`);
  
  if (req.method !== "GET") {
    console.log(`[${requestTime}] Invalid method: ${req.method}`);
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed",
      timestamp: requestTime 
    });
  }

  // Get sessionId from query params
  const { sessionId } = req.query;
  
  if (!sessionId) {
    return res.status(400).json({
      success: false,
      error: "sessionId query parameter is required",
      timestamp: requestTime
    });
  }
  
  console.log(`[${requestTime}] Debug request for sessionId: ${sessionId}`);
  
  try {
    await dbConnect();
    console.log(`[${requestTime}] Database connected successfully`);
    
    // Get recent votes for this session
    const recentVotes = await VotePair.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('card1Id')
      .populate('card2Id')
      .populate('winnerId');
    
    console.log(`[${requestTime}] Found ${recentVotes.length} recent votes for session`);
    
    // Format votes for safe display
    const formattedVotes = recentVotes.map(vote => ({
      id: vote._id.toString(),
      timestamp: vote.timestamp.toISOString(),
      card1: {
        id: vote.card1Id._id.toString(),
        text: vote.card1Id.text
      },
      card2: {
        id: vote.card2Id._id.toString(),
        text: vote.card2Id.text
      },
      winner: {
        id: vote.winnerId._id.toString(),
        text: vote.winnerId.text
      },
      isWinnerCard1: vote.winnerId._id.toString() === vote.card1Id._id.toString()
    }));
    
    // Get current rankings
    const rankings = await VoteRank.find()
      .sort({ rank: 1 })
      .populate('cardId');
    
    console.log(`[${requestTime}] Found ${rankings.length} ranked cards`);
    
    // Format rankings for safe display
    const formattedRankings = rankings.map(rank => ({
      id: rank._id.toString(),
      cardId: rank.cardId._id.toString(),
      text: rank.cardId.text,
      rank: rank.rank,
      wins: rank.wins,
      totalVotes: rank.totalVotes,
      winRate: rank.winRate || 0,
      lastUpdated: rank.lastUpdated ? rank.lastUpdated.toISOString() : null
    }));
    
    // Count total votes for this session
    const totalSessionVotes = await VotePair.countDocuments({ sessionId });
    
    // Prepare and send response
    const response = {
      success: true,
      timestamp: requestTime,
      sessionId,
      stats: {
        totalSessionVotes,
        totalRankedCards: rankings.length
      },
      recentVotes: formattedVotes,
      rankings: formattedRankings
    };
    
    console.log(`[${requestTime}] Sending debug response`);
    return res.status(200).json(response);
    
  } catch (error) {
    console.error(`[${requestTime}] Error in debug endpoint:`, error);
    return res.status(500).json({ 
      success: false, 
      error: "Failed to retrieve debug data",
      message: error.message,
      timestamp: requestTime
    });
  }
}

