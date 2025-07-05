# CardSwipe Architecture

## System Components

### 🗃️ Data Models

#### Card Model
```typescript
interface Card {
  _id: ObjectId;
  url: string;
  createdAt: Date;
}
```

#### Activity Model
```typescript
interface Activity {
  _id: ObjectId;
  type: 'swipe_left' | 'swipe_right' | 'vote_win' | 'vote_lose' | 'view_ranking';
  cardId: ObjectId;
  sessionId: string;
  timestamp: string; // ISO 8601 UTC with ms
  source: string;
}
```

#### Ranking Model
```typescript
interface Ranking {
  _id: ObjectId;
  cardId: ObjectId;
  sessionId: string;
  rank: number;
  weight: number;
  timestamp: string; // ISO 8601 UTC with ms
}
```

### 🔄 Flow Logic

1. **SWIPE Phase**
   - Present single card
   - Record swipe activity
   - Store liked cards in session
   - Proceed to VOTE when 2+ cards liked

2. **VOTE Phase**
   - Binary tournament sorting
   - Compare with existing ranked cards
   - Insert at optimal position
   - Return to SWIPE for more cards

3. **RANKING Phase**
   - Display personal ranking
   - Show global aggregated ranking
   - Enable sharing/export

### 🌐 API Routes

```
POST   /api/cards          # Create new card
GET    /api/cards         # List all cards
PUT    /api/cards/:id     # Update card
DELETE /api/cards/:id     # Delete card

POST   /api/activities    # Log user activity
GET    /api/activities    # Get activity feed

POST   /api/rankings      # Update ranking
GET    /api/rankings      # Get rankings
```

### 📱 UI Components

- `/components/Card.tsx` - Swipeable card component
- `/components/VoteMatch.tsx` - 1v1 comparison view
- `/components/RankingList.tsx` - Sortable ranking display
- `/components/AdminPanel.tsx` - CRUD interface

### 🔐 Authentication

SSO integration via sso.doneisbetter.com:
- OAuth 2.0 flow
- Session management
- Role-based access control

### 📊 Database

MongoDB Collections:
- `cards` - Image card entries
- `activities` - User interaction logs
- `rankings` - Personal and global ranks

### 🚀 Deployment

- Vercel for hosting
- GitHub for version control
- Semantic versioning
- Automated builds and tests
