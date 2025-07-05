import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'URL is required'],
    validate: {
      validator: (v: string) => /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(v),
      message: 'Invalid URL format'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Card || mongoose.model('Card', CardSchema);
