import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
    required: false,
    validate: {
      validator: function(v) {
        // Allow string or ObjectId
        return typeof v === 'string' || v instanceof mongoose.Types.ObjectId || v === null || v === undefined;
      },
      message: props => `${props.value} is not a valid userId!`
    }
  },
  startTime: {
    type: Date,
    required: true,
    default: () => new Date().toISOString()
  },
  endTime: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: {
    currentTime: () => new Date().toISOString()
  }
});

// Ensure proper ISO 8601 format with milliseconds
sessionSchema.pre('save', function(next) {
  if (this.isModified() && this.endTime) {
    this.endTime = new Date().toISOString();
  }
  if (this.isNew) {
    this.startTime = new Date().toISOString();
  }
  next();
});

// Create indexes for faster queries
sessionSchema.index({ userId: 1 });
sessionSchema.index({ startTime: -1 });
sessionSchema.index({ active: 1 });

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session;
