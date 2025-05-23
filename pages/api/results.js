import { z } from 'zod';
import dbConnect from '../../lib/db';
import Interaction from '../../models/Interaction';
import User from '../../models/User';
import Card from '../../models/Card';
import VoteRank from '../../models/VoteRank';

// Schema for validation
const requestSchema = z.object({
  username: z.string().min(1)
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Get username from query parameters
    const username = req.query.username;
    
    if (!username) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username is required' 
      });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Get all interactions for this user
    const interactions = await Interaction.find({ userId: user._id })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .lean();

    // Get all card IDs from interactions
    const cardIds = interactions.map(interaction => interaction.cardId);
    
    // Fetch all cards at once
    const cards = await Card.find({ _id: { $in: cardIds } }).lean();
    
    // Create a map of cardId to card for easy lookup
    const cardMap = cards.reduce((map, card) => {
      map[card._id.toString()] = card;
      return map;
    }, {});

    // Get rankings for these cards
    const rankings = await VoteRank.find({ cardId: { $in: cardIds } }).lean();
    
    // Create a map of cardId to rank for easy lookup
    const rankMap = rankings.reduce((map, ranking) => {
      map[ranking.cardId.toString()] = ranking.rank;
      return map;
    }, {});

    // Filter and format interactions into likes and dislikes
    const likes = [];
    const dislikes = [];

    interactions.forEach(interaction => {
      const cardId = interaction.cardId.toString();
      const card = cardMap[cardId];
      
      if (!card) return; // Skip if card not found

      const result = {
        cardId: cardId,
        text: card.text,
        timestamp: interaction.createdAt,
        rank: rankMap[cardId] !== undefined ? rankMap[cardId] : "unranked"
      };

      // For swipe interactions, right = like, left = dislike
      if (interaction.type === 'swipe') {
        if (interaction.action === 'right') {
          likes.push(result);
        } else if (interaction.action === 'left') {
          dislikes.push(result);
        }
      }
      // For vote interactions, up = like, down = dislike
      else if (interaction.type === 'vote') {
        if (interaction.action === 'up') {
          likes.push(result);
        } else if (interaction.action === 'down') {
          dislikes.push(result);
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        likes,
        dislikes
      }
    });
  } catch (error) {
    console.error('Error in results handler:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

