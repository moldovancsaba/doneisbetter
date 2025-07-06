import { Schema, model, models, Document, Model } from 'mongoose';

// Define the interface for Activity document
export interface IActivity extends Document {
  userId: Schema.Types.ObjectId;
  type: 'task_completed' | 'milestone_reached' | 'streak_achieved' | 'battle_won' | 'battle_lost' | 'battle_draw';
  description: string;
  metadata: Record<string, any>;
  battleOutcome?: {
    opponentId: Schema.Types.ObjectId;
    score: number;
    rank: number;
    skillLevel: number;
    rewards: {
      experiencePoints: number;
      achievements?: string[];
      bonuses?: string[];
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// Define the Activity schema
const ActivitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['task_completed', 'milestone_reached', 'streak_achieved', 'battle_won', 'battle_lost', 'battle_draw'],
    },
    battleOutcome: {
      opponentId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      score: Number,
      rank: Number,
      skillLevel: Number,
      rewards: {
        experiencePoints: {
          type: Number,
          required: true,
          min: 0
        },
        achievements: [String],
        bonuses: [String]
      }
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the Activity model
export const Activity: Model<IActivity> = models.Activity || model<IActivity>('Activity', ActivitySchema);
