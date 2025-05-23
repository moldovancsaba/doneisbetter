import dbConnect from "../../../lib/dbConnect";
import Card from "../../../models/Card";
import VoteRank from "../../../models/VoteRank";
import VotePair from "../../../models/VotePair";

export default async function handler(req, res) {
  const requestTime = new Date().toISOString();
  console.log(`[${requestTime}] Vote submission request received`);
  
  if (req.method !== "POST") {
    console.log(`[${requestTime}] Invalid method: ${req.method}`);
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  console.log(`[${requestTime}] Vote submission request body:`, JSON.stringify(req.body));
  const { sessionId, winnerId, loserId, type } = req.body;

  // Validate required fields
  const validationErrors = [];
  if (!sessionId) validationErrors.push('sessionId is required');
  if (!winnerId) validationErrors.push('winnerId is required');
  if (!loserId) validationErrors.push('loserId is required');
  
  if (validationErrors.length > 0) {
    const errorMessage = `Missing required fields: ${validationErrors.join(', ')}`;
    console.log(`[${requestTime}] Validation error: ${errorMessage}`);
    return res.status(400).json({
      success: false,
      error: errorMessage,
      timestamp: requestTime
    });
  }

  // Validate that winner and loser are different
  if (winnerId === loserId) {
    const errorMessage = "Winner and loser IDs must be different";
    console.log(`[${requestTime}] Validation error: ${errorMessage}`);
    return res.status(400).json({
      success: false,
      error: errorMessage,
      timestamp: requestTime
    });
  }

  console.log(`[${requestTime}] Processing vote with sessionId: ${sessionId}`);
  console.log(`[${requestTime}] Winner ID: ${winnerId}, Loser ID: ${loserId}`);

  try {
    await dbConnect();
    console.log(`[${requestTime}] Database connected successfully`);

    // Verify cards exist
    const winnerCard = await Card.findById(winnerId);
    const loserCard = await Card.findById(loserId);

    if (!winnerCard || !loserCard) {
      const errorMessage = !winnerCard 
        ? `Winner card (${winnerId}) not found` 
        : `Loser card (${loserId}) not found`;
      
      console.log(`[${requestTime}] Validation error: ${errorMessage}`);
      return res.status(404).json({
        success: false,
        error: errorMessage,
        timestamp: requestTime
      });
    }

    console.log(`[${requestTime}] Found winner card: ${winnerCard.text}`);
    console.log(`[${requestTime}] Found loser card: ${loserCard.text}`);

    // Record the vote pair
    const timestamp = new Date();
    const votePairData = {
      card1Id: winnerId,
      card2Id: loserId,
      winnerId,
      sessionId,
      userId: req.body.userId || null,
      timestamp: timestamp
    };
    
    console.log(`[${requestTime}] Creating VotePair document:`, JSON.stringify(votePairData));
    
    const newVotePair = await VotePair.create(votePairData);
    console.log(`[${requestTime}] VotePair created successfully with ID: ${newVotePair._id}`);
    console.log(`[${requestTime}] VotePair timestamp: ${timestamp.toISOString()}`);

    // Fetch existing vote count for this session to verify if this is a new voter
    const existingVoteCount = await VotePair.countDocuments({ sessionId });
    console.log(`[${requestTime}] Existing votes for this session: ${existingVoteCount}`);

    // Update or create rankings with better error handling
    try {
      const winnerRank = await VoteRank.findOne({ cardId: winnerId });
      const loserRank = await VoteRank.findOne({ cardId: loserId });

      console.log(`[${requestTime}] Winner rank:`, winnerRank ? `#${winnerRank.rank}` : 'Not ranked');
      console.log(`[${requestTime}] Loser rank:`, loserRank ? `#${loserRank.rank}` : 'Not ranked');

      // Get current time for the last updated timestamp
      const lastUpdated = new Date();

      if (!winnerRank && !loserRank) {
        // Initial ranking - both cards are new
        console.log(`[${requestTime}] Initial ranking - both cards are new`);
        
        const newRanks = await VoteRank.create([
          { 
            cardId: winnerId, 
            rank: 1, 
            wins: 1, 
            totalVotes: 1,
            lastUpdated
          },
          { 
            cardId: loserId, 
            rank: 2, 
            wins: 0, 
            totalVotes: 1,
            lastUpdated 
          }
        ]);
        
        console.log(`[${requestTime}] Created initial ranks: Winner #1, Loser #2`);
      } else if (!winnerRank) {
        // Winner is new, insert at higher rank than loser
        console.log(`[${requestTime}] Winner is new, insert at rank ${loserRank.rank}`);
        
        // Shift all cards at or above loser's rank down by 1
        await VoteRank.updateMany(
          { rank: { $gte: loserRank.rank } },
          { $inc: { rank: 1 } }
        );
        
        // Create new rank for winner
        const newWinnerRank = await VoteRank.create({
          cardId: winnerId,
          rank: loserRank.rank,
          wins: 1,
          totalVotes: 1,
          lastUpdated
        });
        
        // Update loser's vote count
        await VoteRank.findByIdAndUpdate(loserRank._id, {
          $inc: { totalVotes: 1 },
          lastUpdated
        });
        
        console.log(`[${requestTime}] Created new rank for winner: #${newWinnerRank.rank}`);
        console.log(`[${requestTime}] Updated loser rank to: #${loserRank.rank + 1}`);
      } else if (!loserRank) {
        // Loser is new, insert at lower rank than winner
        console.log(`[${requestTime}] Loser is new, insert below winner at rank ${winnerRank.rank + 1}`);
        
        // Shift all cards at or above new loser rank down by 1
        const newLoserRank = winnerRank.rank + 1;
        await VoteRank.updateMany(
          { rank: { $gte: newLoserRank } },
          { $inc: { rank: 1 } }
        );
        
        // Create new rank for loser
        const newLoserRankDoc = await VoteRank.create({
          cardId: loserId,
          rank: newLoserRank,
          wins: 0,
          totalVotes: 1,
          lastUpdated
        });
        
        // Update winner's vote counts
        await VoteRank.findByIdAndUpdate(winnerRank._id, {
          $inc: { wins: 1, totalVotes: 1 },
          lastUpdated
        });
        
        console.log(`[${requestTime}] Updated winner rank stats at rank #${winnerRank.rank}`);
        console.log(`[${requestTime}] Created new rank for loser: #${newLoserRankDoc.rank}`);
      } else {
        // Both cards are already ranked - need to handle rank adjustment
        console.log(`[${requestTime}] Both cards are ranked: Winner #${winnerRank.rank}, Loser #${loserRank.rank}`);
        
        const higherRank = Math.min(winnerRank.rank, loserRank.rank);
        const lowerRank = Math.max(winnerRank.rank, loserRank.rank);

        if (winnerRank.rank > loserRank.rank) {
          // Winner is currently ranked below loser, need to move winner up
          console.log(`[${requestTime}] Winner is currently ranked below loser, adjusting ranks`);
          console.log(`[${requestTime}] Moving winner from rank #${winnerRank.rank} to rank #${loserRank.rank}`);
          
          // Shift all cards between loser and winner down by 1
          await VoteRank.updateMany(
            { 
              rank: { $gte: loserRank.rank, $lt: winnerRank.rank } 
            },
            { 
              $inc: { rank: 1 },
              lastUpdated
            }
          );
          
          // Update winner's rank and vote counts
          await VoteRank.findByIdAndUpdate(
            winnerRank._id,
            {
              rank: loserRank.rank,
              $inc: { wins: 1, totalVotes: 1 },
              lastUpdated
            }
          );
          
          // Update loser's vote count (and rank is automatically incremented by the updateMany)
          await VoteRank.findByIdAndUpdate(
            loserRank._id,
            {
              $inc: { totalVotes: 1 },
              lastUpdated
            }
          );
          
          console.log(`[${requestTime}] Rank adjustment complete: Winner now at rank #${loserRank.rank}, Loser now at rank #${loserRank.rank + 1}`);
        } else {
          // Winner is already ranked at or above loser, just update vote counts
          console.log(`[${requestTime}] Winner already ranked above loser, updating vote counts only`);
          
          // Update winner's vote counts
          await VoteRank.findByIdAndUpdate(
            winnerRank._id,
            {
              $inc: { wins: 1, totalVotes: 1 },
              lastUpdated
            }
          );
          
          // Update loser's vote count
          await VoteRank.findByIdAndUpdate(
            loserRank._id,
            {
              $inc: { totalVotes: 1 },
              lastUpdated
            }
          );
          
          console.log(`[${requestTime}] Updated vote counts only. Ranks unchanged: Winner #${winnerRank.rank}, Loser #${loserRank.rank}`);
        }
      }
      
      // Update win rates for all ranked cards
      console.log(`[${requestTime}] Updating win rates for all ranked cards`);
      const allRankedCards = await VoteRank.find();
      
      for (const card of allRankedCards) {
        if (card.totalVotes > 0) {
          const winRate = Math.round((card.wins / card.totalVotes) * 100);
          await VoteRank.findByIdAndUpdate(
            card._id,
            { 
              winRate, 
              lastUpdated 
            }
          );
        }
      }
      
      console.log(`[${requestTime}] Rank updates completed successfully`);
    } catch (rankError) {
      console.error(`[${requestTime}] Error updating ranks:`, rankError);
      // We still want to return success for the vote itself even if ranking failed
      console.log(`[${requestTime}] Vote recorded but ranking update failed: ${rankError.message}`);
    }

    const response = {
      success: true,
      message: "Vote recorded successfully",
      timestamp: new Date().toISOString(),
      data: {
        sessionId: sessionId,
        voteId: newVotePair._id.toString()
      }
    };
    
    console.log(`[${requestTime}] Sending success response:`, JSON.stringify(response));
    return res.status(200).json(response);

  } catch (error) {
    const errorTime = new Date().toISOString();
    console.error(`[${errorTime}] Error submitting vote:`, error);
    console.error(`[${errorTime}] Error details:`, {
      message: error.message,
      stack: error.stack,
      sessionId: sessionId,
      winnerId: winnerId,
      loserId: loserId
    });
    
    return res.status(500).json({ 
      success: false, 
      error: "Failed to submit vote", 
      message: error.message,
      timestamp: errorTime
    });
  }
}
