import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 160,
    trim: true
  },
  status: {
    type: String,
    enum: ['liked', 'disliked', 'new'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Card || mongoose.model('Card', cardSchema);
