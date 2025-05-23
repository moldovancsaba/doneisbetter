# API Documentation for Done Is Better

This document provides a comprehensive overview of the REST API endpoints available in the Done Is Better application.

## Base URL

For local development: `http://localhost:3000/api`
For production: `https://done-better.vercel.app/api`

## Authentication

Currently, the API does not require authentication tokens. User identification is managed through session IDs.

## Common Response Format

All API responses follow a standard format:

```json
{
  "success": true|false,
  "data": [result data when success is true],
  "error": "Error message when success is false"
}
```

## Error Handling

The API uses HTTP status codes to indicate the success or failure of requests:

- `200 OK`: Request succeeded
- `201 Created`: Resource successfully created
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `405 Method Not Allowed`: HTTP method not supported for this endpoint
- `500 Internal Server Error`: Server-side error

## API Endpoints

### Cards API

#### `GET /api/cards`

Retrieves all cards sorted by creation date (newest first).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "text": "Card text content",
      "createdAt": "2023-05-20T15:24:32.202Z",
      "updatedAt": "2023-05-20T15:24:32.202Z"
    },
    ...
  ]
}
```

**Error Responses:**
- `500`: Database connection or query error

#### `POST /api/cards`

Creates a new card.

**Request Body:**
```json
{
  "text": "New card text content"
}
```

**Validation:**
- `text` is required
- `text` must not be empty
- `text` must be 160 characters or less

**Response (Success):**
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "text": "New card text content",
  "createdAt": "2023-05-20T15:24:32.202Z",
  "updatedAt": "2023-05-20T15:24:32.202Z"
}
```

**Error Responses:**
- `400`: Validation error (missing or invalid text)
- `500`: Database error

#### `DELETE /api/cards`

Deletes a card by ID.

**Request Body:**
```json
{
  "id": "60d21b4667d0d8992e610c85"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "text": "Card text content",
    "createdAt": "2023-05-20T15:24:32.202Z",
    "updatedAt": "2023-05-20T15:24:32.202Z"
  }
}
```

**Error Responses:**
- `400`: Missing ID
- `404`: Card not found
- `500`: Database error

### Interactions API

#### `POST /api/interactions`

Records a user interaction with a card.

**Request Body:**
```json
{
  "userId": "60d21b4667d0d8992e610c85",
  "cardId": "60d21b4667d0d8992e610c86",
  "type": "swipe|vote",
  "action": "left|right|up|down"
}
```

**Validation:**
- All fields are required
- `type` must be either "swipe" or "vote"
- `action` must be one of "left", "right", "up", or "down"

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "userId": "60d21b4667d0d8992e610c85",
    "cardId": "60d21b4667d0d8992e610c86",
    "type": "vote",
    "action": "up",
    "createdAt": "2023-05-20T15:24:32.202Z"
  }
}
```

**Error Responses:**
- `400`: Validation error
- `404`: User not found
- `500`: Database error

### Vote API

#### `GET /api/vote/pair`

Retrieves a pair of cards for voting.

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session-uuid-123",
    "card1": {
      "_id": "60d21b4667d0d8992e610c85",
      "text": "Card 1 text"
    },
    "card2": {
      "_id": "60d21b4667d0d8992e610c86", 
      "text": "Card 2 text"
    },
    "type": "initial|ranking|refinement",
    "rank1": 5,
    "rank2": 8,
    "currentRank": 3
  }
}
```

The `type` field indicates the purpose of this voting pair:
- `initial`: First-time ranking of new cards
- `ranking`: Placing a new card within existing rankings
- `refinement`: Refining the position of already-ranked cards

The rank fields are only included for certain vote types.

**Error Responses:**
- `500`: Database error or insufficient cards for voting

#### `POST /api/vote/submit`

Records a vote between two cards.

**Request Body:**
```json
{
  "sessionId": "session-uuid-123",
  "winnerId": "60d21b4667d0d8992e610c85",
  "loserId": "60d21b4667d0d8992e610c86",
  "type": "initial|ranking|refinement"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pairId": "60d21b4667d0d8992e610c87",
    "updatedRanks": [
      {
        "cardId": "60d21b4667d0d8992e610c85",
        "oldRank": 5,
        "newRank": 3
      },
      {
        "cardId": "60d21b4667d0d8992e610c86",
        "oldRank": 8,
        "newRank": 9
      }
    ]
  }
}
```

**Error Responses:**
- `400`: Invalid request parameters
- `500`: Database error or ranking calculation error

#### `GET /api/vote/rankings`

Retrieves the current rankings of all cards.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "cardText": "Card text content",
      "rank": 1,
      "wins": 45,
      "totalVotes": 50,
      "winRate": "90%",
      "lastUpdated": "2023-05-20T15:24:32.202Z"
    },
    ...
  ]
}
```

**Error Responses:**
- `500`: Database error

### Results API

#### `GET /api/results`

Retrieves voting statistics and results.

**Query Parameters:**
- `period`: (optional) "day", "week", "month", "all" (default: "all")

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVotes": 250,
    "uniqueCards": 15,
    "topCards": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "text": "Card text content",
        "wins": 45,
        "totalVotes": 50
      },
      ...
    ],
    "recentActivity": [
      {
        "date": "2023-05-20T15:24:32.202Z",
        "votes": 25
      },
      ...
    ]
  }
}
```

**Error Responses:**
- `400`: Invalid period parameter
- `500`: Database error

## Known Issues and Limitations

1. No rate limiting is currently implemented
2. Large result sets are not paginated
3. No authentication or authorization mechanism
4. The API may return different error formats for unhandled exceptions

## Changelog

- v0.1.0 (2023-05-23): Initial API documentation

