import dbConnect from '../../lib/dbConnect';
import Card from '../../models/Card';

export default async function handler(req, res) {
  const { method } = req;

  // Connect to database
  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ success: false, error: 'Database connection failed' });
  }

  switch (method) {
    // GET - Fetch all cards
    case 'GET':
      try {
        const cards = await Card.find({}).sort({ createdAt: -1 });
        res.status(200).json(cards);
      } catch (error) {
        console.error('GET cards error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch cards' });
      }
      break;

    // POST - Create a new card
    case 'POST':
      try {
        const { text } = req.body;
        
        if (!text || text.trim() === '') {
          return res.status(400).json({ success: false, error: 'Card text is required' });
        }
        
        if (text.length > 160) {
          return res.status(400).json({ success: false, error: 'Card text must be 160 characters or less' });
        }
        
        const card = await Card.create({ text });
        res.status(201).json(card);
      } catch (error) {
        console.error('POST card error:', error);
        res.status(500).json({ success: false, error: 'Failed to create card' });
      }
      break;

    // DELETE - Delete a card
    case 'DELETE':
      try {
        const { id } = req.body;
        
        if (!id) {
          return res.status(400).json({ success: false, error: 'Card ID is required' });
        }
        
        const deletedCard = await Card.findByIdAndDelete(id);
        
        if (!deletedCard) {
          return res.status(404).json({ success: false, error: 'Card not found' });
        }
        
        res.status(200).json({ success: true, data: deletedCard });
      } catch (error) {
        console.error('DELETE card error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete card' });
      }
      break;

    // For unsupported methods
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

