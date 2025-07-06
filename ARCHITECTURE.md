# CardSwipe Architecture

## System Components

### 🗃️ Data Models

#### Card Model
```typescript
interface Card {
  _id: ObjectId;
  title: string;            // Card title, max 100 chars
  description: string;      // Card description, max 1000 chars
  createdAt: Date;         // ISO 8601 UTC with ms
  updatedAt?: Date;        // ISO 8601 UTC with ms
}
```

#### Activity Model
```typescript
interface Activity {
  _id: ObjectId;
  userId: ObjectId;
  type: 'task_completed' | 'milestone_reached' | 'streak_achieved' | 'battle_won' | 'battle_lost' | 'battle_draw';
  description: string;
  metadata: Record<string, any>;
  battleOutcome?: {
    opponentId: ObjectId;
    score: number;
    rank: number;
    skillLevel: number;
    rewards: {
      experiencePoints: number;
      achievements?: string[];
      bonuses?: string[];
    };
  };
  createdAt: string;  // ISO 8601 UTC with ms
  updatedAt: string;  // ISO 8601 UTC with ms
}
```

#### Ranking Model
```typescript
interface Ranking {
  _id: ObjectId;
  cardId: ObjectId;
  userId: ObjectId;
  score: number;
  level: number;
  category: string;
  achievements: string[];
  progressiveStats: {
    winStreak: number;
    totalWins: number;
    totalBattles: number;
    rankProgress: number;  // Progress to next rank (0-100)
    skillRating: number;   // ELO-like rating
    consistency: number;   // Performance consistency (0-100)
  };
  rankHistory: Array<{
    rank: number;
    date: string;         // ISO 8601 UTC with ms
    reason: string;
  }>;
  seasonalStats: {
    season: string;
    highestRank: number;
    totalPoints: number;
    achievements: string[];
  };
  lastUpdated: string;    // ISO 8601 UTC with ms
  createdAt: string;      // ISO 8601 UTC with ms
  updatedAt: string;      // ISO 8601 UTC with ms
}
```

### 🔄 Flow Logic

1. **VOTE Phase**
   - Present card comparison
   - Handle vote inputs (swipe/keyboard)
   - Record vote in real-time
   - Update rankings immediately

2. **SWIPE Phase**
   - Process swipe gestures
   - Validate swipe thresholds
   - Trigger vote actions
   - Provide visual feedback

3. **RANKING Phase**
   - Calculate scores from votes
   - Update global rankings
   - Broadcast changes via WebSocket
   - Display real-time updates

### 🌐 API Routes

```
POST   /api/cards          # Create new card
GET    /api/cards          # List all cards
PUT    /api/cards/:id      # Update card
DELETE /api/cards/:id      # Delete card

POST   /api/activities     # Log user activity
GET    /api/rankings       # Get rankings
```

### 📱 UI Components

- `/components/Card.tsx` - Card display component
- `/components/RankingList.tsx` - Ranking display
- `/app/cards/page.tsx` - Card management page

### 📊 Database

#### Connection Pattern
The application uses a singleton database connection pattern to prevent connection pool exhaustion:
- Connection is established once during app initialization
- Connection is reused across all database operations
- Automatic reconnection handling with exponential backoff
- Connection pooling with optimal size based on workload

#### Model Registration
Models follow a centralized registration pattern:
1. Models are defined in `/models` directory
2. Each model is registered once through the model registry
3. Models are imported and used via the registry to prevent duplicate registrations
4. Type safety is enforced through TypeScript interfaces

#### Model Relationships
The application uses referential integrity through MongoDB references:

1. **Card → Activities**
   - One-to-many relationship
   - Activities reference cards through `cardId`
   - Cascade deletion handled in application layer

2. **Card → Rankings**
   - One-to-many relationship
   - Rankings reference cards through `cardId`
   - Independent lifecycle management

3. **Session → Activities & Rankings**
   - One-to-many relationship
   - Both collections reference `sessionId`
   - Used for user session tracking

MongoDB Collections:
- `cards` - Card entries
- `activities` - User interaction and battle outcome logs
- `rankings` - Progressive ranking and seasonal stats data

### 🚀 Deployment

- Vercel for hosting
- GitHub for version control
- Semantic versioning
