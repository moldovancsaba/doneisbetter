import dbConnect from "../../../lib/dbConnect";
import Card from "../../../models/Card";
import VoteRank from "../../../models/VoteRank";
import VotePair from "../../../models/VotePair";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { sessionId, winnerId, loserId, type } = req.body;

  if (!sessionId || !winnerId || !loserId) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: sessionId, winnerId, loserId. Please ensure all required data is sent."
    });
  }

  try {
    await dbConnect();

    // Record the vote pair
    await VotePair.create({
      card1Id: winnerId,
      card2Id: loserId,
      winnerId,
      timestamp: new Date()
    });

    // Update or create rankings
    const winnerRank = await VoteRank.findOne({ cardId: winnerId });
    const loserRank = await VoteRank.findOne({ cardId: loserId });

    if (!winnerRank && !loserRank) {
      // Initial ranking
      await VoteRank.create([
        { cardId: winnerId, rank: 1, wins: 1, totalVotes: 1 },
        { cardId: loserId, rank: 2, wins: 0, totalVotes: 1 }
      ]);
    } else if (!winnerRank) {
      // Winner is new, insert at higher rank
      const newRank = loserRank.rank;
      await VoteRank.updateMany(
        { rank: { $gte: newRank } },
        { $inc: { rank: 1 } }
      );
      await VoteRank.create({
        cardId: winnerId,
        rank: newRank,
        wins: 1,
        totalVotes: 1
      });
    } else if (!loserRank) {
      // Loser is new, insert at lower rank
      const newRank = winnerRank.rank + 1;
      await VoteRank.updateMany(
        { rank: { $gte: newRank } },
        { $inc: { rank: 1 } }
      );
      await VoteRank.create({
        cardId: loserId,
        rank: newRank,
        wins: 0,
        totalVotes: 1
      });
    } else {
      // Both cards are ranked, adjust ranks
      const higherRank = Math.min(winnerRank.rank, loserRank.rank);
      const lowerRank = Math.max(winnerRank.rank, loserRank.rank);

      if (winnerRank.rank > loserRank.rank) {
        // Winner moves up, loser stays
        await VoteRank.updateMany(
          { rank: { $gte: higherRank, $lt: lowerRank } },
          { $inc: { rank: 1 } }
        );
        await VoteRank.findByIdAndUpdate(winnerRank._id, {
          rank: higherRank,
          $inc: { wins: 1, totalVotes: 1 }
        });
        await VoteRank.findByIdAndUpdate(loserRank._id, {
          $inc: { totalVotes: 1 }
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Vote recorded successfully"
    });

  } catch (error) {
    console.error("Error submitting vote:", error);
    return res.status(500).json({ success: false, error: "Failed to submit vote" });
  }
}
