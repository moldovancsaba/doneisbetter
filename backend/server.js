require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

const taskSchema = new mongoose.Schema({
  todo: [String],
  inProgress: [String],
  done: [String]
});
const Task = mongoose.model('Task', taskSchema);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.findOne();
  if (!tasks) {
    const newTasks = new Task({ todo: ["Sample Task"], inProgress: [], done: [] });
    await newTasks.save();
    return res.json(newTasks);
  }
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const tasks = await Task.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  res.json(tasks);
});

app.post('/tasks/add', async (req, res) => {
  const { column, task } = req.body;
  const tasks = await Task.findOne();
  tasks[column].push(task);
  await tasks.save();
  res.json(tasks);
});

app.delete('/tasks/delete', async (req, res) => {
  const { column, index } = req.body;
  const tasks = await Task.findOne();
  tasks[column].splice(index, 1);
  await tasks.save();
  res.json(tasks);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
