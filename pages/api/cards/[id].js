import dbConnect from '../../../lib/dbConnect';
import Card from '../../../models/Card';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  // Connect to database
  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ success: false, error: 'Database connection failed' });
  }

  switch (method) {
    // GET - Fetch a specific card
    case 'GET':
      try {
        const card = await Card.findById(id);
        
        if (!card) {
          return res.status(404).json({ success: false, error: 'Card not found' });
        }
        
        res.status(200).json({ success: true, data: card });
      } catch (error) {
        console.error('GET card error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch card' });
      }
      break;

    // PUT - Update a card
    case 'PUT':
      try {
        const { text } = req.body;
        
        if (!text || text.trim() === '') {
          return res.status(400).json({ success: false, error: 'Card text is required' });
        }
        
        if (text.length > 160) {
          return res.status(400).json({ success: false, error: 'Card text must be 160 characters or less' });
        }
        
        const updatedCard = await Card.findByIdAndUpdate(
          id, 
          { text, updatedAt: new Date() }, 
          { new: true, runValidators: true }
        );
        
        if (!updatedCard) {
          return res.status(404).json({ success: false, error: 'Card not found' });
        }
        
        res.status(200).json({ success: true, data: updatedCard });
      } catch (error) {
        console.error('PUT card error:', error);
        res.status(500).json({ success: false, error: 'Failed to update card' });
      }
      break;

    // DELETE - Delete a card
    case 'DELETE':
      try {
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
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

