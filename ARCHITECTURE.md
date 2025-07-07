# CardSwipe Architecture

## UI Component Architecture

### Core Container Rules

#### 1. Card Component (`/src/components/common/Card.tsx`)
- **Sacred Rule:** Original image aspect ratio MUST NEVER be modified
- Uses natural image dimensions to determine display size
- No width/height constraints that could affect aspect ratio
- No CSS transforms that modify proportions

#### 2. Container Hierarchy

##### Root Container
```tsx
<div className="fixed inset-x-0 top-[calc(50%+40px)] -translate-y-1/2">
```
- Fixed positioning for viewport-relative placement
- Accounts for 80px navigation height
- Uses transform for perfect vertical centering

##### Width Constraints
```tsx
<div className="max-w-[80vw] mx-auto">
```
- Maximum width of 80% viewport width
- Auto margins for horizontal centering
- Never forces aspect ratio changes

##### Card Scaling
```tsx
<CardComponent className="shadow-xl scale-90">
```
- Scale transforms only affect size, not aspect ratio
- Height-based scaling at 90%
- Maintains image proportions

### View-Specific Implementations

#### 1. Swipe Phase
- Fixed positioning with vertical center transform
- Single card display with gesture controls
- Natural image dimensions preserved
- Container size adapts to content

#### 2. Vote Phase
- Side-by-side card comparison
- Equal scaling for both cards
- Navigation-aware vertical centering
- 5vw gap between cards

### Layout Management

#### Vertical Centering Strategy
1. Fixed positioning with inset-x-0
2. top-[calc(50%+40px)] for nav offset
3. -translate-y-1/2 for perfect centering
4. Container adapts to content height

#### Width Management
1. max-w-[80vw] constraint
2. Automatic horizontal margins
3. Flexible inner containers
4. Gap management with gap-[5vw]

#### Height Considerations
1. Natural height from content
2. No fixed height constraints
3. Proper scaling with scale-90
4. Navigation offset (80px) factored in

### Critical Implementation Rules

#### 1. Aspect Ratio Preservation
- NEVER modify image aspect ratios
- NEVER use aspect-ratio CSS property
- NEVER force square or specific ratios
- ALWAYS let images determine dimensions

#### 2. Container Guidelines
- Use fixed positioning for root containers
- Implement proper transform-based centering
- Account for navigation height in calculations
- Maintain consistent scaling across views

#### 3. Scaling Rules
- Scale by height, not width
- Use uniform scale factor (90%)
- Preserve aspect ratios during scaling
- Apply scaling through transforms only

#### 4. Responsiveness
- Use viewport-relative units (vw/vh)
- Implement proper max-width constraints
- Maintain consistent gaps
- Ensure cross-device compatibility

### Testing Requirements

1. Verify aspect ratio preservation
2. Check vertical centering accuracy
3. Validate navigation offset handling
4. Ensure consistent card scaling
5. Test responsive behavior

### Performance Considerations

1. Use transform for animations
2. Implement proper event cleanup
3. Optimize container reflows
4. Manage render efficiency

## Integration Points

### Navigation System
- 80px fixed height
- Impacts vertical centering
- Requires offset calculations

### Image Processing
- Natural dimensions preserved
- No forced resizing
- Aspect ratio maintenance

### Interaction Layer
- Touch/click handling
- Gesture recognition
- Animation management

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

#### Image Handling System
The application implements a robust image handling system through the Card component:

**Features:**
- Automatic aspect ratio preservation
- Cross-browser drag prevention
- Touch interaction blocking
- Responsive sizing
- Error recovery with exponential backoff

**Technical Implementation:**
```typescript
// Aspect ratio handling
const aspectRatio = img.width / img.height || 1;
style={{ aspectRatio, width: '100%', maxWidth: '100%' }}

// Interaction prevention
className="touch-none select-none pointer-events-none"

// Error handling with retries
if (retryCount < maxRetries) {
  setTimeout(() => retry(), Math.pow(2, retryCount) * 1000);
}
```

**Performance Optimizations:**
- CSS-based sizing calculations
- Lazy loading for all images
- Minimal resize operations
- Proper event listener cleanup
- Controlled component re-renders

#### Core Components
- `/components/common/Card.tsx` - Centralized card display component with image handling
- `/components/layout/Navigation.tsx` - Centralized navigation component
- `/components/layout/OrientationProvider.tsx` - Orientation management for responsive layout

#### Feature Components
- `/components/SwipePhase.tsx` - Handles the swipe interaction phase
- `/components/VoteBattle.v2.tsx` - Improved voting logic with orientation support
- `/components/RankingPage` - Ranking display with responsive card layout

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
