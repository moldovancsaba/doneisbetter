const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
require('dotenv').config();
const Task = require('./models/Task');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => { 
  console.log('Connected to MongoDB Atlas'); 
})
.catch(err => { 
  console.error('MongoDB connection error:', err); 
});

app.get('/', (req, res) => {
  res.send('Doneisbetter Backend is running smoothly!');
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findOne().sort({ _id: -1 }).exec();
    res.json(tasks || { todo: [], inProgress: [], done: [] });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }
    const existingTasks = await Task.findOne().sort({ _id: -1 }).exec();
    if (existingTasks) {
      existingTasks.todo.push(task);
      await existingTasks.save();
    } else {
      const newTask = new Task({ todo: [task], inProgress: [], done: [] });
      await newTask.save();
    }
    io.emit('tasksUpdated');
    res.json({ message: 'Task added successfully' });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
