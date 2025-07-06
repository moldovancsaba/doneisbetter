# CardSwipe Architecture

## System Components

### 🗃️ Data Models

#### Card Model
```typescript
interface Card {
  _id: ObjectId;
  title: string;            // Card title, max 100 chars
  description: string;      // Card description, max 1000 chars
  imageUrl: string;         // URL to card image (validated)
  rank?: number;           // ELO-style ranking score (default: 1400)
  battlesWon?: number;     // Count of battles won
  battlesLost?: number;    // Count of battles lost
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

1. **SWIPE Phase**
   - Display cards for initial evaluation
   - Process swipe gestures (right = like, left = dislike)
   - Validate swipe thresholds and image URLs
   - Accumulate liked cards for comparison
   - Switch to VOTE phase when enough cards are liked

2. **VOTE Phase**
   - Present direct card comparisons
   - Handle vote inputs (keyboard/click)
   - Update ELO-style rankings in real-time
   - Persist rank changes to database
   - Return to SWIPE phase when comparisons complete

3. **RANKING System**
   - Default rank: 1400 (new cards)
   - Rank change: ±32 points per battle
   - Progressive difficulty (battle better cards after wins)
   - Immediate rank updates and persistence
   - Sorted display in rankings view

### 🌐 API Routes

```
POST   /api/cards              # Create new card
GET    /api/cards              # List all cards
PUT    /api/cards/:id          # Update card
DELETE /api/cards/:id          # Delete card
POST   /api/cards/updateRank   # Update card's ranking score

POST   /api/activities         # Log user activity
GET    /api/rankings          # Get current rankings
```

### 📱 UI Components

#### Core Components
- `/components/common/Card.tsx` - Centralized card display component
- `/components/layout/Navigation.tsx` - Centralized navigation component

#### Feature Components
- `/components/RankingList.tsx` - Ranking display
- `/app/cards/page.tsx` - Card management page

All pages must use these centralized components to maintain consistency. Custom variations are not allowed.

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
