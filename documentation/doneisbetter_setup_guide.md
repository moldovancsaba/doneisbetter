# DoneIsBetter: Setup Guide

## Overview
DoneIsBetter is a simple Hello World app with the following functionality:
- A Google-like input field to add text as cards in a single column
- Cards are stored in MongoDB so they can be viewed anywhere, anytime
- Real-time synchronization: Cards added on one screen are instantly visible on all screens

## Prerequisites
Ensure you have the following tools installed:
- macOS 15.3 on a Mac M1 computer
- Node.js v22.14.0
- npm (Comes with Node.js)
- MongoDB Atlas Account
- Vercel Account
- GitHub Account

## Initial Setup

DoneIsBetter: Full Setup Guide

This guide details how to set up the DoneIsBetter project from scratch, including frontend, backend, and real-time synchronization with MongoDB Atlas. Follow each command exactly as written to avoid errors. The guide is optimized for macOS 15.3 on a Mac M1 computer.

1. Clear and Recreate Project Folder

cd /Users/moldovan/Projects/
rm -rf doneisbetter
mkdir doneisbetter
cd doneisbetter

2. Initialize GitHub Repository

git init
git remote add origin https://github.com/moldovancsaba/doneisbetter.git

3. Setup Backend

mkdir backend
cd backend
npm init -y
npm install express mongoose socket.io cors dotenv

3.1 Create Environment File for Backend

cat > /Users/moldovan/Projects/doneisbetter/backend/.env << 'EOF'
MONGO_URI=mongodb+srv://thanperfect:CuW54NNNFKnGQtt6@doneisbetter.49s2z.mongodb.net/doneisbetter?retryWrites=true&w=majority
PORT=5001
EOF

3.2 Create Server File

cat > /Users/moldovan/Projects/doneisbetter/backend/server.js << 'EOF'
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
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

const Task = require('./models/Task');

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
        res.status(201).json({ message: 'Task added successfully' });
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

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
EOF

3.3 Create Task Model

mkdir -p /Users/moldovan/Projects/doneisbetter/backend/models
cat > /Users/moldovan/Projects/doneisbetter/backend/models/Task.js << 'EOF'
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  todo: {
    type: Array,
    required: true
  },
  inProgress: {
    type: Array,
    default: []
  },
  done: {
    type: Array,
    default: []
  }
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
EOF

4. Setup Frontend

cd /Users/moldovan/Projects/doneisbetter
mkdir frontend
cd frontend
npx create-next-app@latest . --use-npm --js
npm install socket.io-client axios

4.1 Create Environment File for Frontend

cat > /Users/moldovan/Projects/doneisbetter/frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5001
EOF

4.2 Edit index.js for Frontend

cat > /Users/moldovan/Projects/doneisbetter/frontend/pages/index.js << 'EOF'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default function Home() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });

  useEffect(() => {
    fetchTasks();
    socket.on('tasksUpdated', fetchTasks);
    return () => {
      socket.off('tasksUpdated');
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data || { todo: [], inProgress: [], done: [] });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (task.trim() === '') return;
    try {
      await axios.post('/tasks', { task });
      setTask('');
      socket.emit('tasksUpdated');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Hello World App</h1>
      <div className="max-w-md mx-auto">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a card"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <div className="space-y-2">
          {tasks.todo.map((card, index) => (
            <div key={index} className="p-4 bg-white rounded shadow">
              {card}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
EOF

5. Run the Project Locally

cd /Users/moldovan/Projects/doneisbetter/backend
npm start

cd /Users/moldovan/Projects/doneisbetter/frontend
npm run dev

6. GitHub and Vercel Deployment

cd /Users/moldovan/Projects/doneisbetter
git add .
git commit -m "Initial commit: Working Hello World version with real-time sync"
git push origin main

Ensure that both frontend and backend are deployed on Vercel and use the correct environment variables for production.

7. Troubleshooting and Notes
	•	If MongoDB connection fails, check .env file in the backend and verify the connection string.
	•	This is a Hello World app for a Kanban-style workspace. Future enhancements will include more functionalities.

This setup guide ensures the project is replicated error-free with real-time synchronization and MongoDB persistence.