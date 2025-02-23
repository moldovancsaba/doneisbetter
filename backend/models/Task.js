const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  todo: {
    type: [String],
    required: true
  },
  inProgress: {
    type: [String],
    required: true
  },
  done: {
    type: [String],
    required: true
  }
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
