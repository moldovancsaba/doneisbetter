const express = require('express');
const router = express.Router();
const ImageCard = require('../../../models/ImageCard');
const Vote = require('../../../models/Vote');

/**
 * POST /api/cards
 * Creates a new image card
 */
router.post('/cards', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const card = new ImageCard({ url });
    await card.save();
    
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/cards
 * Fetches all image cards with their votes
 */
router.get('/cards', async (req, res) => {
  try {
    const cards = await ImageCard.find()
      .populate('votes')
      .sort({ createdAt: -1 });
    
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/votes
 * Records a vote for an image card
 */
router.post('/votes', async (req, res) => {
  try {
    const { imageId, vote } = req.body;
    
    if (!imageId || ![-1, 1].includes(vote)) {
      return res.status(400).json({ 
        error: 'Image ID and valid vote value (+1 or -1) are required' 
      });
    }

    // Verify image exists
    const image = await ImageCard.findById(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const newVote = new Vote({ imageId, vote });
    await newVote.save();

    res.status(201).json(newVote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/votes/stats
 * Gets voting statistics for all images
 */
router.get('/votes/stats', async (req, res) => {
  try {
    const stats = await Vote.aggregate([
      {
        $group: {
          _id: '$imageId',
          totalVotes: { $sum: 1 },
          score: { $sum: '$vote' },
          upvotes: {
            $sum: {
              $cond: [{ $eq: ['$vote', 1] }, 1, 0]
            }
          },
          downvotes: {
            $sum: {
              $cond: [{ $eq: ['$vote', -1] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'imagecards',
          localField: '_id',
          foreignField: '_id',
          as: 'image'
        }
      },
      {
        $unwind: '$image'
      },
      {
        $project: {
          imageId: '$_id',
          url: '$image.url',
          totalVotes: 1,
          score: 1,
          upvotes: 1,
          downvotes: 1,
          _id: 0
        }
      },
      {
        $sort: { score: -1 }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
