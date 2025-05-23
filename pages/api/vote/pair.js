import dbConnect from "../../../lib/dbConnect";
import Card from "../../../models/Card";
import VoteRank from "../../../models/VoteRank";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    await dbConnect();

    // Find cards that have not been ranked yet
    const unrankedCards = await Card.find({
      _id: { 
        $nin: await VoteRank.distinct("cardId") 
      }
    }).limit(10);

    // Get ranked cards
    const rankedCards = await VoteRank.find()
      .sort({ rank: 1 })
      .populate("cardId")
      .limit(10);

    // Generate session ID
    const sessionId = uuidv4();
    
    // First voting scenario: No ranked cards yet
    if (rankedCards.length === 0) {
      if (unrankedCards.length < 2) {
        return res.status(400).json({ 
          success: false, 
          error: "Not enough cards to create a voting pair" 
        });
      }
      
      // Select two random unranked cards
      const shuffled = [...unrankedCards].sort(() => 0.5 - Math.random());
      
      return res.status(200).json({
        success: true,
        data: {
          card1: shuffled[0],
          card2: shuffled[1],
          sessionId,
          type: "initial"
        }
      });
    }

    // Regular voting scenario: One ranked card and one unranked card
    if (unrankedCards.length > 0) {
      const randomUnranked = unrankedCards[Math.floor(Math.random() * unrankedCards.length)];
      const randomRanked = rankedCards[Math.floor(Math.random() * rankedCards.length)];
      
      return res.status(200).json({
        success: true,
        data: {
          card1: randomUnranked,
          card2: randomRanked.cardId,
          sessionId,
          type: "ranking",
          currentRank: randomRanked.rank
        }
      });
    }

    // All cards are ranked, select two ranked cards for refinement
    if (rankedCards.length >= 2) {
      const [card1, card2] = rankedCards
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      
      return res.status(200).json({
        success: true,
        data: {
          card1: card1.cardId,
          card2: card2.cardId,
          sessionId,
          type: "refinement",
          rank1: card1.rank,
          rank2: card2.rank
        }
      });
    }

    return res.status(400).json({ 
      success: false, 
      error: "Unable to create a voting pair" 
    });
    
  } catch (error) {
    console.error("Error getting vote pair:", error);
    return res.status(500).json({ success: false, error: "Failed to get voting pair" });
  }
}
