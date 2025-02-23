const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();
const Card = require('./models/Card');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

const server = app.listen(process.env.PORT || 5001, () => {
  console.log(`Server running on port ${process.env.PORT || 5001}`);
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Doneisbetter Backend is running smoothly!');
});

app.get('/cards', async (req, res) => {
  try {
    const cardData = await Card.findOne().sort({ _id: -1 }).exec();
    res.json(cardData || { cards: [] });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/cards', async (req, res) => {
  try {
    const newCard = new Card({ cards: req.body.cards });
    await newCard.save();
    io.emit('cardAdded', newCard);
    res.json({ message: 'Card added successfully' });
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
