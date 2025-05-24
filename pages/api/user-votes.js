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
    
    let rightSwipedCards = [];
    let rightSwipedCardData = []; // Move declaration outside try-catch for proper scope
    try {
      rightSwipedCards = await Interaction.find(rightSwipedQuery)
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
      
      // Convert right-swiped card IDs to strings for easier comparison later
      const rightSwipedCardIds = rightSwipedCards.map(id => id.toString());
      
      // Fetch the actual card data for all right-swiped cards
      rightSwipedCardData = await Card.find({
        _id: { $in: rightSwipedCards }
      });
      
      console.log(`[${requestTime}] Fetched ${rightSwipedCardData.length} card documents for right-swiped cards`);
      
      // Create a map for quick lookups
      const rightSwipedCardsMap = new Map();
      rightSwipedCardData.forEach(card => {
        rightSwipedCardsMap.set(card._id.toString(), card);
      });
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
      
      // Note: We don't return early if no votes found, because we still want to return right-swiped cards
      // even if the user hasn't voted on any cards yet
    } catch (votePairsError) {
      console.error(`[${requestTime}] Error fetching vote pairs:`, votePairsError);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch vote pairs",
        errorDetail: votePairsError.message,
        timestamp: requestTime
      });
    }

    // Initialize our data structure for tracking card information
    const cardsMap = new Map();
    
    // First, add ALL right-swiped cards to the cardsMap
    // This ensures we include all right-swiped cards even if they weren't voted on
    if (rightSwipedCardData && rightSwipedCardData.length > 0) {
      rightSwipedCardData.forEach(card => {
      const cardId = card._id.toString();
      cardsMap.set(cardId, {
        _id: card._id,
        cardText: card.cardText || card.text || card.content || card.title || `Card #${cardId.substring(0, 6)}`,
        createdAt: card.createdAt || new Date(),
        lastVoted: card.updatedAt || new Date(),
        wasSwipedRight: true,
        // Initialize vote stats (will be updated if the card was voted on)
        wins: 0,
        totalVotes: 0,
        winRate: 0
      });
    });
    }
    
    console.log(`[${requestTime}] Added ${cardsMap.size} right-swiped cards to the cards map`);

    // Add debug logging for vote pairs structure
    if (votePairs && votePairs.length > 0) {
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
        // Try different possible field names
        if (card.text !== undefined) return card.text;
        if (card.cardText !== undefined) return card.cardText;
        if (card.content !== undefined) return card.content;
        if (card.title !== undefined) return card.title;
        
        // If no text field is found, return a placeholder
        return 'Card #' + card._id.toString().substring(0, 6);
      } catch (error) {
        console.error(`[${requestTime}] Error getting card text:`, error);
        return 'Error reading card';
      }
    };
    
    // Now process vote pairs to update the vote statistics for cards that have been voted on
    if (votePairs && votePairs.length > 0) {
      votePairs.forEach(vote => {
        const card1Id = vote.card1Id._id.toString();
        const card2Id = vote.card2Id._id.toString();
        const winnerId = vote.winnerId._id.toString();
        
        // Update card1 voting statistics if it's in our map (was swiped right)
        const card1 = cardsMap.get(card1Id);
        if (card1) {
          card1.totalVotes = (card1.totalVotes || 0) + 1;
          if (card1Id === winnerId) {
            card1.wins = (card1.wins || 0) + 1;
          }
          
          // Update lastVoted time if this vote is more recent
          if (new Date(vote.timestamp) > new Date(card1.lastVoted)) {
            card1.lastVoted = vote.timestamp;
          }
        }
        
        // Update card2 voting statistics if it's in our map (was swiped right)
        const card2 = cardsMap.get(card2Id);
        if (card2) {
          card2.totalVotes = (card2.totalVotes || 0) + 1;
          if (card2Id === winnerId) {
            card2.wins = (card2.wins || 0) + 1;
          }
          
          // Update lastVoted time if this vote is more recent
          if (new Date(vote.timestamp) > new Date(card2.lastVoted)) {
            card2.lastVoted = vote.timestamp;
          }
        }
      });
      
      // Calculate win rates for all cards that have votes
      for (const [cardId, cardData] of cardsMap.entries()) {
        if (cardData.totalVotes > 0) {
          cardData.winRate = Math.round((cardData.wins / cardData.totalVotes) * 100);
        }
      }
    }
    
    // Convert Map to Array for formatting and sorting
    const cardIdsArray = Array.from(cardsMap.keys());

    console.log(`[${requestTime}] Found ${cardIdsArray.length} unique cards that were swiped right`);
    
    // If no cards were found, return an empty array immediately
    if (cardIdsArray.length === 0) {
      console.log(`[${requestTime}] No cards found that were swiped right`);
      return res.status(200).json({
        success: true,
        data: [],
        votesCount: votePairs ? votePairs.length : 0,
        uniqueCards: 0,
        rightSwipedCards: rightSwipedCardData ? rightSwipedCardData.length : 0,
        message: "No cards found that were swiped right",
        timestamp: requestTime
      });
    }

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

    // Create the final formatted rankings from all cards user has swiped right on
    const formattedRankings = cardIdsArray.map(cardId => {
      const cardData = cardsMap.get(cardId);
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
        wins: cardData?.wins || 0,
        totalVotes: cardData?.totalVotes || 0,
        winRate: cardData?.winRate || 0,
        wasSwipedRight: true, // We're only including cards swiped right
        lastUpdated: globalRanking ? globalRanking.lastUpdated : cardData?.lastVoted || new Date().toISOString(),
        createdAt: cardData?.createdAt || new Date().toISOString(),
        lastVoted: cardData?.lastVoted || new Date().toISOString()
      };
    });

    // Sort by personal win rate (descending), then by total votes (descending)
    formattedRankings.sort((a, b) => {
      // First sort by win rate (descending) - but only if both have votes
      if (a.totalVotes > 0 && b.totalVotes > 0 && b.winRate !== a.winRate) {
        return b.winRate - a.winRate;
      }
      // Then by total votes (descending)
      if (b.totalVotes !== a.totalVotes) {
        return b.totalVotes - a.totalVotes;
      }
      // Then by voting status - cards with votes come first
      if ((a.totalVotes > 0) !== (b.totalVotes > 0)) {
        return a.totalVotes > 0 ? -1 : 1;
      }
      // Finally by last voted/interaction time (most recent first)
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
      votesCount: votePairs ? votePairs.length : 0,
      uniqueCards: cardIdsArray.length,
      rightSwipedCards: rightSwipedCardData ? rightSwipedCardData.length : 0,
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

