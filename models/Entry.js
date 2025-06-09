const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['created', 'updated', 'edited'],
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  }
}, { _id: false });

const EntrySchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  activities: [ActivitySchema]
});

module.exports = mongoose.models.Entry || mongoose.model('Entry', EntrySchema);
