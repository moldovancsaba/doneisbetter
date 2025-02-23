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

const TaskSchema = new mongoose.Schema({
  todo: { type: Array, default: [] },
  inProgress: { type: Array, default: [] },
  done: { type: Array, default: [] }
});

const Task = mongoose.model('Task', TaskSchema);

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
    if (task) {
      let tasks = await Task.findOne().sort({ _id: -1 }).exec();
      if (!tasks) {
        tasks = new Task({ todo: [] });
      }
      tasks.todo.push(task);
      await tasks.save();

      io.emit('tasksUpdated');
      res.status(201).json({ message: 'Task added successfully' });
    } else {
      res.status(400).json({ error: 'Task is required' });
    }
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('tasksUpdated', () => {
    io.emit('tasksUpdated');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
