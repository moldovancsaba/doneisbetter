import { Server } from 'socket.io';
import dbConnect from '../../lib/dbConnect';
import Card from '../../models/Card';

// Store active socket connections
let io;

export default async function handler(req, res) {
  // Connect to MongoDB
  await dbConnect();

  // Return early for non-socket requests
  if (res.socket.server.io) {
    console.log('Socket.io already running');
    res.end();
    return;
  }

  console.log('Setting up Socket.io server...');
  
  // Initialize socket.io server
  const io = new Server(res.socket.server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://doneisbetter.com', 'https://www.doneisbetter.com'] 
        : 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  
  // Store io instance on server
  res.socket.server.io = io;
  
  // Socket.io connection handler
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Send initial cards data to connected client
    socket.on('get-cards', async () => {
      try {
        const cards = await Card.find({}).sort({ createdAt: -1 });
        socket.emit('cards', cards);
      } catch (error) {
        console.error('Error fetching cards:', error);
        socket.emit('error', { message: 'Failed to fetch cards' });
      }
    });
    
    // Handle new card creation events
    socket.on('create-card', async (cardData) => {
      try {
        if (!cardData.text || cardData.text.length > 160) {
          socket.emit('error', { message: 'Invalid card data' });
          return;
        }
        
        const card = await Card.create({ text: cardData.text });
        
        // Broadcast to all clients
        io.emit('card-created', card);
        socket.emit('create-success', card);
      } catch (error) {
        console.error('Error creating card:', error);
        socket.emit('error', { message: 'Failed to create card' });
      }
    });
    
    // Handle card deletion events
    socket.on('delete-card', async (cardId) => {
      try {
        if (!cardId) {
          socket.emit('error', { message: 'Card ID is required' });
          return;
        }
        
        const deletedCard = await Card.findByIdAndDelete(cardId);
        
        if (!deletedCard) {
          socket.emit('error', { message: 'Card not found' });
          return;
        }
        
        // Broadcast to all clients
        io.emit('card-deleted', cardId);
        socket.emit('delete-success', cardId);
      } catch (error) {
        console.error('Error deleting card:', error);
        socket.emit('error', { message: 'Failed to delete card' });
      }
    });
    
    // Handle card swipe events
    socket.on('swipe-card', async ({ cardId, direction }) => {
      try {
        // Just log the swipe for now, we'll expand this in the future
        console.log(`Card ${cardId} swiped ${direction === 'right' ? 'liked' : 'disliked'}`);
        
        // Broadcast to other admin clients
        socket.broadcast.emit('card-swiped', { cardId, direction });
      } catch (error) {
        console.error('Error processing swipe:', error);
      }
    });
    
    // Clean up on disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
  
  console.log('Socket.io server started');
  res.end();
}

