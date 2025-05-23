import dbConnect from '../../lib/dbConnect';
import VotePair from '../../models/VotePair';
import VoteRank from '../../models/VoteRank';
import Card from '../../models/Card';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { sessionId, userId } = req.query;

  // Either sessionId or userId is required
  if (!sessionId && !userId) {
    return res.status(400).json({ 
      success: false, 
      error: 'Either sessionId or userId is required' 
    });
  }

  try {
    await dbConnect();

    // Build query based on provided parameters
    const query = {};
    if (sessionId) query.sessionId = sessionId;
    if (userId) query.userId = userId;

    console.log(`Fetching votes for ${sessionId ? 'sessionId: ' + sessionId : 'userId: ' + userId}`);

    // Get all vote pairs from this user/session
    const votePairs = await VotePair.find(query)
      .sort({ timestamp: -1 })
      .populate('card1Id')
      .populate('card2Id')
      .populate('winnerId');

    console.log(`Found ${votePairs.length} vote pairs for this session`);

    if (votePairs.length === 0) {
      // No votes found for this session
      return res.status(200).json({
        success: true,
        data: [],
        votesCount: 0,
        message: "No votes found for this session"
      });
    }

    // Get unique card IDs from votes and build a map of cards
    const cardIds = new Set();
    const cardsMap = new Map();

    // Add debug logging for first vote pair to examine structure
    if (votePairs.length > 0) {
      console.log('First vote pair structure sample:', JSON.stringify({
        card1Id: votePairs[0].card1Id._id.toString(),
        card1Fields: Object.keys(votePairs[0].card1Id._doc || votePairs[0].card1Id),
        card2Id: votePairs[0].card2Id._id.toString(),
        card2Fields: Object.keys(votePairs[0].card2Id._doc || votePairs[0].card2Id)
      }));
    }
    
    // Helper function to get card text safely
    const getCardText = (card) => {
      // Check various possible field names for the card text
      if (!card) return 'Unknown Card';
      
      // Debug the card structure
      console.log('Card fields:', Object.keys(card._doc || card));
      
      // Try different possible field names
      if (card.text !== undefined) return card.text;
      if (card.cardText !== undefined) return card.cardText;
      if (card.content !== undefined) return card.content;
      if (card.title !== undefined) return card.title;
      
      // If no text field is found, return a placeholder
      return 'Card #' + card._id.toString().substring(0, 6);
    };
    
    votePairs.forEach(vote => {
      // Add card1 to map if not already there
      const card1Id = vote.card1Id._id.toString();
      if (!cardsMap.has(card1Id)) {
        cardsMap.set(card1Id, {
          _id: vote.card1Id._id,
          cardText: getCardText(vote.card1Id),
          createdAt: vote.card1Id.createdAt || vote.timestamp,
          lastVoted: vote.timestamp
        });
      }

      // Add card2 to map if not already there
      const card2Id = vote.card2Id._id.toString();
      if (!cardsMap.has(card2Id)) {
        cardsMap.set(card2Id, {
          _id: vote.card2Id._id,
          cardText: getCardText(vote.card2Id),
          createdAt: vote.card2Id.createdAt || vote.timestamp,
          lastVoted: vote.timestamp
        });
      }

      // Update lastVoted time if this vote is more recent
      const card1 = cardsMap.get(card1Id);
      const card2 = cardsMap.get(card2Id);
      
      if (new Date(vote.timestamp) > new Date(card1.lastVoted)) {
        card1.lastVoted = vote.timestamp;
      }
      
      if (new Date(vote.timestamp) > new Date(card2.lastVoted)) {
        card2.lastVoted = vote.timestamp;
      }

      cardIds.add(card1Id);
      cardIds.add(card2Id);
    });

    // Convert Set to Array for querying
    const cardIdsArray = Array.from(cardIds);

    console.log(`Found ${cardIdsArray.length} unique cards voted on`);

    // Calculate personal vote statistics for each card
    const personalStats = {};
    
    // Initialize personal stats for each card
    cardIdsArray.forEach(cardId => {
      personalStats[cardId] = {
        wins: 0,
        totalVotes: 0,
        winRate: 0
      };
    });
    
    // Count personal votes and wins
    votePairs.forEach(vote => {
      const card1Id = vote.card1Id._id.toString();
      const card2Id = vote.card2Id._id.toString();
      const winnerId = vote.winnerId._id.toString();
      
      // Increment total votes for both cards
      personalStats[card1Id].totalVotes++;
      personalStats[card2Id].totalVotes++;
      
      // Increment wins for the winning card
      personalStats[winnerId].wins++;
    });
    
    // Calculate win rates
    Object.keys(personalStats).forEach(cardId => {
      const stats = personalStats[cardId];
      stats.winRate = stats.totalVotes > 0 
        ? Math.round((stats.wins / stats.totalVotes) * 100) 
        : 0;
    });

    // Get global ranking information for these cards (if available)
    const globalRankings = await VoteRank.find({
      cardId: { $in: cardIdsArray }
    });

    // Create a map of global rankings for easy lookup
    const globalRankMap = {};
    globalRankings.forEach(ranking => {
      globalRankMap[ranking.cardId.toString()] = {
        rank: ranking.rank,
        lastUpdated: ranking.lastUpdated
      };
    });

    // Create the final formatted rankings from all cards user has voted on
    const formattedRankings = cardIdsArray.map(cardId => {
      const cardData = cardsMap.get(cardId);
      const personalCardStats = personalStats[cardId];
      const globalRanking = globalRankMap[cardId];
      
      // Validate card data and provide defaults for missing values
      if (!cardData) {
        console.error(`Missing card data for ID: ${cardId}`);
      }
      
      return {
        _id: cardData?._id || cardId,
        cardText: cardData?.cardText || `Card #${cardId.substring(0, 6)}`,
        // Use global rank if available, otherwise null
        rank: globalRanking ? globalRanking.rank : null,
        wins: personalCardStats?.wins || 0,
        totalVotes: personalCardStats?.totalVotes || 0,
        winRate: personalCardStats?.winRate || 0,
        lastUpdated: globalRanking ? globalRanking.lastUpdated : cardData?.lastVoted || new Date().toISOString(),
        createdAt: cardData?.createdAt || new Date().toISOString(),
        lastVoted: cardData?.lastVoted || new Date().toISOString()
      };
    });

    // Sort by personal win rate (descending), then by total votes (descending)
    formattedRankings.sort((a, b) => {
      // First sort by win rate (descending)
      if (b.winRate !== a.winRate) {
        return b.winRate - a.winRate;
      }
      // Then by total votes (descending)
      if (b.totalVotes !== a.totalVotes) {
        return b.totalVotes - a.totalVotes;
      }
      // Finally by last voted time (most recent first)
      return new Date(b.lastVoted) - new Date(a.lastVoted);
    });

    console.log(`Returning ${formattedRankings.length} ranked cards`);
    
    // Debug the first few formatted cards
    if (formattedRankings.length > 0) {
      console.log('First 2 formatted cards:', JSON.stringify(formattedRankings.slice(0, 2)));
    } else {
      console.log('No formatted rankings to return');
    }

    return res.status(200).json({
      success: true,
      data: formattedRankings,
      votesCount: votePairs.length,
      uniqueCards: cardIdsArray.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error getting user votes:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to get user votes',
      errorMessage: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

