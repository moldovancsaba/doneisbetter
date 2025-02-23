const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, { 
  cors: { 
    origin: 'https://doneisbetter.vercel.app', 
    methods: ['GET', 'POST'], 
    credentials: true 
  }, 
  transports: ['websocket'] 
});


app.use(cors());
app.use(express.json());

const TaskSchema = new mongoose.Schema({
  todo: [String],
  inProgress: [String],
  done: [String]
});

const Task = mongoose.model('Task', TaskSchema);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findOne();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findOne();
    tasks.todo = req.body.todo;
    tasks.inProgress = req.body.inProgress;
    tasks.done = req.body.done;
    await tasks.save();
    io.emit('tasksUpdated', req.body);  // Emit update event
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
