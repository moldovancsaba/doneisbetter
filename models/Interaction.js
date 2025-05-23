import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  type: {
    type: String,
    enum: ['swipe', 'vote'],
    required: true
  },
  action: {
    type: String,
    enum: ['left', 'right', 'up', 'down'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Interaction || mongoose.model('Interaction', interactionSchema);

