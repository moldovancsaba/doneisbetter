import dbConnect from "../../../lib/dbConnect";
import Card from "../../../models/Card";
import VoteRank from "../../../models/VoteRank";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  const requestTime = new Date().toISOString();
  console.log(`[${requestTime}] Vote pair request received`);
  
  if (req.method !== "GET") {
    console.log(`[${requestTime}] Invalid method: ${req.method}`);
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed",
      timestamp: requestTime 
    });
  }

  try {
    await dbConnect();
    console.log(`[${requestTime}] Database connected successfully`);

    // Find cards that have not been ranked yet
    const unrankedCards = await Card.find({
      _id: { 
        $nin: await VoteRank.distinct("cardId") 
      }
    }).limit(10);
    
    console.log(`[${requestTime}] Found ${unrankedCards.length} unranked cards`);

    // Get ranked cards
    const rankedCards = await VoteRank.find()
      .sort({ rank: 1 })
      .populate("cardId")
      .limit(10);
    
    console.log(`[${requestTime}] Found ${rankedCards.length} ranked cards`);
    
    // Helper function to ensure consistent card data format
    const formatCardData = (card) => {
      // If card is already a populated Card document
      if (card && typeof card === 'object' && !card.cardId && card.text) {
        console.log(`[${requestTime}] Card is already a Card document`);
        return {
          _id: card._id.toString(),
          text: card.text,
          createdAt: card.createdAt || new Date()
        };
      }
      
      // If card is a populated VoteRank reference (cardId)
      if (card && typeof card === 'object' && card.cardId && card.cardId.text) {
        console.log(`[${requestTime}] Card is a populated VoteRank reference`);
        return {
          _id: card.cardId._id.toString(),
          text: card.cardId.text,
          createdAt: card.cardId.createdAt || new Date()
        };
      }
      
      // If it's an unexpected format, log and return basic info
      console.log(`[${requestTime}] Unexpected card format:`, JSON.stringify(card));
      if (card && typeof card === 'object') {
        return {
          _id: card._id ? card._id.toString() : 'unknown',
          text: card.text || 'Unknown card content',
          createdAt: card.createdAt || new Date()
        };
      }
      
      console.error(`[${requestTime}] Invalid card data:`, card);
      return null;
    };
    
    // First voting scenario: No ranked cards yet
    if (rankedCards.length === 0) {
      if (unrankedCards.length < 2) {
        console.log(`[${requestTime}] Not enough cards to create a voting pair`);
        return res.status(400).json({ 
          success: false, 
          error: "Not enough cards to create a voting pair",
          timestamp: requestTime
        });
      }
      
      // Select two random unranked cards
      const shuffled = [...unrankedCards].sort(() => 0.5 - Math.random());
      const card1 = formatCardData(shuffled[0]);
      const card2 = formatCardData(shuffled[1]);
      
      if (!card1 || !card2) {
        console.error(`[${requestTime}] Failed to format card data`);
        return res.status(500).json({ 
          success: false, 
          error: "Failed to format card data",
          timestamp: requestTime
        });
      }
      
      const response = {
        success: true,
        data: {
          card1,
          card2,
          type: "initial",
          timestamp: requestTime
        }
      };
      
      console.log(`[${requestTime}] Returning initial voting pair`);
      return res.status(200).json(response);
    }

    // Regular voting scenario: One ranked card and one unranked card
    // Regular voting scenario: One ranked card and one unranked card
    if (unrankedCards.length > 0) {
      const randomUnranked = unrankedCards[Math.floor(Math.random() * unrankedCards.length)];
      const randomRanked = rankedCards[Math.floor(Math.random() * rankedCards.length)];
      
      console.log(`[${requestTime}] Creating ranking pair with unranked and ranked card`);
      console.log(`[${requestTime}] Unranked card:`, randomUnranked._id.toString());
      console.log(`[${requestTime}] Ranked card:`, randomRanked.cardId._id.toString());
      
      const card1 = formatCardData(randomUnranked);
      const card2 = formatCardData(randomRanked);
      
      if (!card1 || !card2) {
        console.error(`[${requestTime}] Failed to format card data for ranking scenario`);
        return res.status(500).json({ 
          success: false, 
          error: "Failed to format card data",
          timestamp: requestTime
        });
      }
      
      const response = {
        success: true,
        data: {
          card1,
          card2,
          type: "ranking",
          currentRank: randomRanked.rank,
          timestamp: requestTime
        }
      };
      
      console.log(`[${requestTime}] Returning ranking voting pair`);
      return res.status(200).json(response);
    }

    // All cards are ranked, select two ranked cards for refinement
    if (rankedCards.length >= 2) {
      const [rank1, rank2] = rankedCards
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      
      console.log(`[${requestTime}] Creating refinement pair with two ranked cards`);
      console.log(`[${requestTime}] Card 1 (rank ${rank1.rank}):`, rank1.cardId._id.toString());
      console.log(`[${requestTime}] Card 2 (rank ${rank2.rank}):`, rank2.cardId._id.toString());
      
      const card1 = formatCardData(rank1);
      const card2 = formatCardData(rank2);
      
      if (!card1 || !card2) {
        console.error(`[${requestTime}] Failed to format card data for refinement scenario`);
        return res.status(500).json({ 
          success: false, 
          error: "Failed to format card data",
          timestamp: requestTime
        });
      }
      
      const response = {
        success: true,
        data: {
          card1,
          card2,
          type: "refinement",
          rank1: rank1.rank,
          rank2: rank2.rank,
          timestamp: requestTime
        }
      };
      
      console.log(`[${requestTime}] Returning refinement voting pair`);
      return res.status(200).json(response);
    }

    console.log(`[${requestTime}] No valid voting scenario available`);
    return res.status(400).json({ 
      success: false, 
      error: "Unable to create a voting pair",
      timestamp: requestTime
    });
    
  } catch (error) {
    const errorTime = new Date().toISOString();
    console.error(`[${errorTime}] Error getting vote pair:`, error);
    console.error(`[${errorTime}] Error details:`, {
      message: error.message,
      stack: error.stack
    });
    
    return res.status(500).json({ 
      success: false, 
      error: "Failed to get voting pair",
      message: error.message,
      timestamp: errorTime
    });
  }
}
