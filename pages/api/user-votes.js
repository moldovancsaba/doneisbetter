import dbConnect from '../../lib/dbConnect';
import VotePair from '../../models/VotePair';
import VoteRank from '../../models/VoteRank';
import Card from '../../models/Card';
import Interaction from '../../models/Interaction';

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

  // Add request timestamp for consistent logging
  const requestTime = new Date().toISOString();
  console.log(`[${requestTime}] User votes request received with sessionId: ${sessionId || 'none'}, userId: ${userId || 'none'}`);
  
  try {
    console.log(`[${requestTime}] Connecting to database...`);
    await dbConnect();
    console.log(`[${requestTime}] Database connected successfully`);

    // Build query based on provided parameters
    const query = {};
    if (sessionId) query.sessionId = sessionId;
    if (userId) query.userId = userId;
    
    console.log(`[${requestTime}] Query parameters:`, query);
    
    // Find all cards that have been swiped right by this user/session
    const rightSwipedQuery = sessionId 
      ? { sessionId, type: 'swipe', action: 'right' }
      : { userId, type: 'swipe', action: 'right' };
      
    console.log(`[${requestTime}] Finding right-swiped cards with query:`, rightSwipedQuery);
    
    try {
      const rightSwipedCards = await Interaction.find(rightSwipedQuery)
        .distinct('cardId');
      
      console.log(`[${requestTime}] Found ${rightSwipedCards.length} cards that were swiped right`);
      
      // Log the first few card IDs for debugging
      if (rightSwipedCards.length > 0) {
        console.log(`[${requestTime}] Sample right-swiped cards:`, 
          rightSwipedCards.slice(0, 3).map(id => id.toString()));
      }
    
    if (rightSwipedCards.length === 0) {
      // No cards have been swiped right by this user/session
      console.log(`[${requestTime}] No cards have been swiped right by this user/session`);
      return res.status(200).json({
        success: true,
        data: [],
        votesCount: 0,
        message: "No cards have been swiped right by this user/session",
        timestamp: requestTime
      });
    }
    } catch (interactionError) {
      console.error(`[${requestTime}] Error fetching right-swiped cards:`, interactionError);
      // Continue with empty array to handle this gracefully
      return res.status(200).json({
        success: true,
        data: [],
        votesCount: 0,
        error: "Error fetching swiped cards",
        errorDetail: interactionError.message,
        timestamp: requestTime
      });
    }

    console.log(`[${requestTime}] Fetching votes for ${sessionId ? 'sessionId: ' + sessionId : 'userId: ' + userId}`);

    // Get all vote pairs from this user/session
    let votePairs;
    try {
      votePairs = await VotePair.find(query)
        .sort({ timestamp: -1 })
        .populate('card1Id')
        .populate('card2Id')
        .populate('winnerId');

      console.log(`[${requestTime}] Found ${votePairs.length} vote pairs for this session`);

      if (votePairs.length === 0) {
        // No votes found for this session
        console.log(`[${requestTime}] No votes found for this session`);
        return res.status(200).json({
          success: true,
          data: [],
          votesCount: 0,
          message: "No votes found for this session",
          timestamp: requestTime
        });
      }
    } catch (votePairsError) {
      console.error(`[${requestTime}] Error fetching vote pairs:`, votePairsError);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch vote pairs",
        errorDetail: votePairsError.message,
        timestamp: requestTime
      });
    }

    // Get unique card IDs from votes and build a map of cards
    const cardIds = new Set();
    const cardsMap = new Map();
    
    // Handle cases where rightSwipedCards is undefined or not an array
    let rightSwipedCardIds = [];
    try {
      if (Array.isArray(rightSwipedCards)) {
        rightSwipedCardIds = rightSwipedCards.map(id => id.toString());
        console.log(`[${requestTime}] Converted ${rightSwipedCardIds.length} right-swiped card IDs to strings`);
      } else {
        console.error(`[${requestTime}] rightSwipedCards is not an array:`, rightSwipedCards);
      }
    } catch (mapError) {
      console.error(`[${requestTime}] Error converting right-swiped cards to strings:`, mapError);
    }

    // Add debug logging for first vote pair to examine structure
    if (votePairs.length > 0) {
      try {
        console.log(`[${requestTime}] First vote pair structure sample:`, JSON.stringify({
          card1Id: votePairs[0].card1Id._id.toString(),
          card1Fields: Object.keys(votePairs[0].card1Id._doc || votePairs[0].card1Id),
          card2Id: votePairs[0].card2Id._id.toString(),
          card2Fields: Object.keys(votePairs[0].card2Id._doc || votePairs[0].card2Id)
        }));
      } catch (structureError) {
        console.error(`[${requestTime}] Error logging vote pair structure:`, structureError);
      }
    }
    
    // Helper function to get card text safely
    const getCardText = (card) => {
      // Check various possible field names for the card text
      if (!card) return 'Unknown Card';
      
      try {
        // Debug the card structure
        console.log(`[${requestTime}] Card fields:`, Object.keys(card._doc || card));
        
        // Try different possible field names
        if (card.text !== undefined) return card.text;
        if (card.cardText !== undefined) return card.cardText;
        if (card.content !== undefined) return card.content;
        if (card.title !== undefined) return card.title;
        
        // If no text field is found, return a placeholder
        return 'Card #' + card._id.toString().substring(0, 6);
      } catch (error) {
        console.error(`[${requestTime}] Error getting card text:`, error, 'Card:', card);
        return 'Error reading card';
      }
    };
    
    votePairs.forEach(vote => {
      // Add card1 to map if not already there AND it was swiped right
      const card1Id = vote.card1Id._id.toString();
      if (!cardsMap.has(card1Id) && rightSwipedCardIds.includes(card1Id)) {
        cardsMap.set(card1Id, {
          _id: vote.card1Id._id,
          cardText: getCardText(vote.card1Id),
          createdAt: vote.card1Id.createdAt || vote.timestamp,
          lastVoted: vote.timestamp,
          wasSwipedRight: true
        });
      }

      // Add card2 to map if not already there AND it was swiped right
      const card2Id = vote.card2Id._id.toString();
      if (!cardsMap.has(card2Id) && rightSwipedCardIds.includes(card2Id)) {
        cardsMap.set(card2Id, {
          _id: vote.card2Id._id,
          cardText: getCardText(vote.card2Id),
          createdAt: vote.card2Id.createdAt || vote.timestamp,
          lastVoted: vote.timestamp,
          wasSwipedRight: true
        });
      }

      // Update lastVoted time if this vote is more recent
      const card1 = cardsMap.get(card1Id);
      const card2 = cardsMap.get(card2Id);
      
      if (card1 && new Date(vote.timestamp) > new Date(card1.lastVoted)) {
        card1.lastVoted = vote.timestamp;
      }
      
      if (card2 && new Date(vote.timestamp) > new Date(card2.lastVoted)) {
        card2.lastVoted = vote.timestamp;
      }

      // Only add cards that were swiped right
      if (rightSwipedCardIds.includes(card1Id)) {
        cardIds.add(card1Id);
      }
      
      if (rightSwipedCardIds.includes(card2Id)) {
        cardIds.add(card2Id);
      }
    });

    // Convert Set to Array for querying - these are cards both voted on AND swiped right
    const cardIdsArray = Array.from(cardIds);

    console.log(`[${requestTime}] Found ${cardIdsArray.length} unique cards that were both voted on AND swiped right`);
    
    // If no cards were found, return an empty array immediately
    if (cardIdsArray.length === 0) {
      console.log(`[${requestTime}] No cards found that were both voted on AND swiped right`);
      return res.status(200).json({
        success: true,
        data: [],
        votesCount: votePairs.length,
        uniqueCards: 0,
        rightSwipedCards: rightSwipedCardIds.length,
        message: "No cards found that meet the criteria",
        timestamp: requestTime
      });
    }

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
        wasSwipedRight: true, // We're only including cards swiped right
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

    console.log(`[${requestTime}] Successfully processed user votes, returning ${formattedRankings.length} rankings`);
    return res.status(200).json({
      success: true,
      data: formattedRankings,
      votesCount: votePairs.length,
      uniqueCards: cardIdsArray.length,
      rightSwipedCards: rightSwipedCardIds.length,
      timestamp: requestTime
    });
    
  } catch (error) {
    console.error(`[${requestTime}] Error getting user votes:`, error);
    console.error(`[${requestTime}] Error stack:`, error.stack);
    
    // Determine if this is a database error
    let errorType = "unknown";
    if (error.name === "MongoError" || error.name === "MongooseError") {
      errorType = "database";
    } else if (error.name === "ValidationError") {
      errorType = "validation";
    } else if (error.name === "CastError") {
      errorType = "cast";
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to get user votes',
      errorType: errorType,
      errorMessage: error.message,
      timestamp: requestTime
    });
  }
}

