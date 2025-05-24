# DoneisBetter System Documentation [2025-05-24T02:40:43.789Z]

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Components](#architecture-components)
3. [Core Algorithms](#core-algorithms)
4. [Frontend Implementation](#frontend-implementation)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [Environment Variables](#environment-variables)
8. [Deployment Process](#deployment-process)

## System Overview

DoneisBetter is a modern web application for comparing and ranking items through a combination of swiping and voting mechanisms. The application implements a sophisticated ranking algorithm that dynamically adjusts item positions based on user votes. The system has several core features:

- **Card Management**: Create, update, and browse items presented as cards
- **Swipe Interface**: Quick decision-making with swipe gestures
- **Voting Arena**: Head-to-head comparison of items
- **Rankings**: Dynamically updated rankings based on ELO-inspired algorithm
- **Administration**: Management of cards and system settings

The application follows a modern Next.js architecture with server-side rendering, API routes, and real-time capabilities through Socket.io.

## Architecture Components

### Frontend Architecture

The frontend is built with Next.js and follows a component-based architecture with the following organization:

```
components/
├── base/           # Base components
├── feature/        # Feature-specific components
├── features/       # Feature modules
│   ├── swipe/      # Swipe interface components
│   └── vote/       # Voting interface components
├── layout/         # Layout components
│   ├── Header.js   # Main navigation header
│   ├── Layout.js   # Page layout wrapper
│   └── MobileNav.js # Mobile navigation menu
└── ui/             # Reusable UI components
```

#### Key Components

1. **Navigation Components**:
   - `Header.js`: Desktop navigation menu with links to all main sections
   - `Navigation.js`: Alternative navigation component
   - `MobileNav.js`: Mobile-optimized navigation

2. **Feature Components**:
   - `SwipeCard.js`: Card swiping implementation with gesture controls
   - `CardStack.js`: Management of card stacks for swiping
   - `VoteArena.js`: Voting interface for head-to-head comparison
   - `VoteCard.js`: Card display in voting interface
   - `VoteControls.js`: Voting control buttons and keyboard navigation

3. **UI Components**:
   - Various reusable UI elements (buttons, cards, modals, etc.)
   - Animation components for transitions

### Backend Architecture

The backend is implemented within the Next.js framework using API routes and serverless functions:

```
pages/
├── api/           # API endpoints
│   ├── cards/     # Card management endpoints
│   ├── vote/      # Voting endpoints
│   │   ├── pair.js       # Get card pairs for voting
│   │   ├── rankings.js   # Get current rankings
│   │   └── submit.js     # Submit vote results
│   ├── interactions/     # User interaction tracking
│   └── results/          # Results and analytics
└── [page].js      # Frontend pages
```

### Database Architecture

The application uses MongoDB with Mongoose ODM for data management:

```
models/
├── Card.js        # Card schema and model
├── VotePair.js    # Vote pair tracking
└── VoteRank.js    # Card rankings
```

## Core Algorithms

### Voting and Ranking Algorithm

The ranking system implements a sophisticated algorithm that dynamically adjusts item positions based on user votes. Here's how it works:

1. **Initial Ranking**:
   - When two unranked cards are compared, the winner gets rank 1, loser gets rank 2
   - The system initializes with wins, totalVotes, and other metrics

2. **New Card vs. Ranked Card**:
   - When a new card wins against a ranked card, it takes that rank position
   - All cards at or below that position are shifted down
   - When a new card loses, it's placed one rank below the winner

3. **Ranked vs. Ranked Card**:
   - When a higher-ranked card wins against a lower-ranked card, only vote counts update
   - When a lower-ranked card wins against a higher-ranked card, the winner moves up to the loser's position
   - Cards between their positions are shifted down

4. **Win Rate Calculation**:
   - Win rate is calculated as: `winRate = (wins / totalVotes) * 100`
   - This provides a percentage-based metric for card performance

#### Ranking Implementation Details

```javascript
// Pseudo-code for ranking algorithm core
if (!winnerRank && !loserRank) {
  // Both cards are new
  createRank(winner, 1);
  createRank(loser, 2);
} else if (!winnerRank) {
  // Winner is new
  shiftRanksDown(loserRank.rank);
  createRank(winner, loserRank.rank);
  updateVoteCounts(loser);
} else if (!loserRank) {
  // Loser is new
  shiftRanksDown(winnerRank.rank + 1);
  createRank(loser, winnerRank.rank + 1);
  updateVoteCounts(winner);
} else if (winnerRank.rank > loserRank.rank) {
  // Winner is currently ranked below loser
  shiftRanksBetween(loserRank.rank, winnerRank.rank);
  updateRank(winner, loserRank.rank);
  updateVoteCounts(loser);
} else {
  // Winner already ranked above loser
  updateVoteCounts(winner);
  updateVoteCounts(loser);
}
```

### Swipe Mechanism

The swipe interface uses gesture detection to allow users to make quick decisions:

1. **Gesture Detection**: Uses touch and mouse events to detect swipe direction
2. **Direction Processing**:
   - Right swipe: Positive/Like
   - Left swipe: Negative/Dislike
   - Up swipe: Super like (when implemented)
3. **Animation Flow**:
   - Card follows finger/mouse position with physics-based animation
   - When released, card either returns to center (if not swiped far enough) or completes the swipe animation
   - Next card is revealed with transition animation

## Frontend Implementation

### State Management

The application uses React's built-in state management with Context API for global state:

1. **Local Component State**: For UI-specific state (animations, local form data)
2. **Context Providers**: For shared state (theme, user preferences, authentication)
3. **Real-time Updates**: Socket.io for live updates to rankings and votes

### Navigation System

The navigation system consists of multiple components that work together:

1. **Header.js**: Main navigation menu for desktop view with items:
   - Home 🏠
   - Rankings 🏆
   - Swipe 🔄
   - Vote 🗳️
   - Admin ⚙️

2. **MobileNav.js**: Mobile-optimized navigation with similar items

3. **Key Navigation Features**:
   - Active page highlighting
   - Dark/light mode toggle (🌙/🌞)
   - Animated transitions between pages
   - Mobile responsiveness

### UI Components

The UI is built with a combination of Tailwind CSS and custom components:

1. **Card Components**: For displaying items in various contexts
2. **Button Components**: Various button styles for actions
3. **Modal Components**: For dialogs and pop-ups
4. **Animation Components**: For transitions and micro-interactions

## API Reference

### Card Management API

#### `GET /api/cards`
Retrieves a list of cards with optional filtering.

#### `POST /api/cards`
Creates a new card.

#### `GET /api/cards/[id]`
Retrieves a specific card by ID.

#### `PUT /api/cards/[id]`
Updates a specific card.

#### `DELETE /api/cards/[id]`
Deletes a specific card.

### Vote API

#### `GET /api/vote/pair`
Retrieves a pair of cards for voting with the following types:
- `initial`: First-time ranking of new cards
- `ranking`: Placing a new card within existing rankings
- `refinement`: Refining the position of already-ranked cards

#### `POST /api/vote/submit`
Records a vote between two cards and updates rankings.

**Request Parameters:**
- `sessionId`: Unique session identifier
- `winnerId`: ID of the winning card
- `loserId`: ID of the losing card
- `type`: Vote type (initial, ranking, refinement)

**Algorithm Overview:**
1. Validate input parameters
2. Check if cards exist
3. Record vote in VotePair collection
4. Update rankings based on algorithm rules
5. Recalculate win rates for all cards

#### `GET /api/vote/rankings`
Retrieves the current rankings of all cards sorted by rank.

### Results API

#### `GET /api/results`
Retrieves voting statistics and results with optional period filtering.

## Database Schema

### Card Schema

```javascript
const CardSchema = new Schema({
  text: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### VotePair Schema

```javascript
const VotePairSchema = new Schema({
  card1Id: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
  card2Id: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
  winnerId: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
  sessionId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});
```

### VoteRank Schema

```javascript
const VoteRankSchema = new Schema({
  cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true, unique: true },
  rank: { type: Number, required: true },
  wins: { type: Number, default: 0 },
  totalVotes: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});
```

## Environment Variables

The application uses the following environment variables:

### Required Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Optional Variables

```
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### Environment Setup

Environment variables can be configured in:
1. `.env` file for defaults
2. `.env.local` for local overrides
3. Vercel project settings for deployment environments

## Deployment Process

The application is deployed on Vercel with the following workflow:

### Deployment Environments

1. **Development**: Automatic deployments from feature branches
2. **Staging**: Deployments from the `dev` branch
3. **Production**: Deployments from the `main` branch

### Deployment Steps

1. Push code to the appropriate GitHub branch
2. Vercel automatically builds the application
3. Environment variables are applied from Vercel project settings
4. The application is deployed to the corresponding environment

### Monitoring

1. **Application Monitoring**: Vercel Analytics
2. **Error Tracking**: Built-in error logging
3. **Database Monitoring**: MongoDB Atlas monitoring

## Conclusion

DoneisBetter implements a sophisticated ranking system using a combination of swipe and vote interfaces. The core algorithms provide a dynamic way to rank items based on user preferences, while the modern Next.js architecture ensures fast performance and maintainability.

## Version Control

- Documentation Version: 1.0.0
- Last Updated: 2025-05-24T02:40:43.789Z
- Update Frequency: As needed with significant changes

## Related Documentation

- [01_roadmap.md](01_roadmap.md) - Project phases
- [02_Technology_Stack.md](02_Technology_Stack.md) - Technical details
- [15_architecture_and_design.md](15_architecture_and_design.md) - System architecture
- [20_project_structure.md](20_project_structure.md) - Codebase organization

