import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure the model is only defined once
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export default Message;
