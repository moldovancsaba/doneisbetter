require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

const CardSchema = new mongoose.Schema({
});

const Card = mongoose.model('Card', CardSchema);

app.get('/', (req, res) => {
  res.send('Doneisbetter Backend is running smoothly!');
});

app.get('/cards', async (req, res) => {
  try {
    const cards = await Card.findOne().sort({ _id: -1 }).exec();
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/cards', async (req, res) => {
  try {
    const { task } = req.body;
    if (task) {
      let cards = await Card.findOne().sort({ _id: -1 }).exec();
      if (!cards) {
      }
      await cards.save();

      io.emit('cardsUpdated');
      res.status(201).json({ message: 'Card added successfully' });
    } else {
      res.status(400).json({ error: 'Card is required' });
    }
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('cardsUpdated', () => {
    io.emit('cardsUpdated');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
