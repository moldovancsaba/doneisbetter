# DoneisBetter Technical Documentation

## Architecture Overview

### Frontend Architecture
The application follows a component-based architecture using Next.js and React. Key architectural decisions include:

- **Component Hierarchy**:
  - UI Components (Atomic design principles)
  - Feature Components (Business logic)
  - Layout Components (Page structure)
  - Page Components (Route handlers)

- **State Management**:
  - React Context for global state
  - Local state for component-specific data
  - Socket.io for real-time updates

### Backend Architecture
The backend is built using Next.js API routes and Socket.io:

- **API Routes**: `/api/*` handles HTTP requests
- **Socket.io**: Real-time communication
- **MongoDB**: Data persistence

## Real-time Implementation

### Socket.io Events
```javascript
// Server-side events
'connection'      // New client connection
'disconnect'      // Client disconnection
'get-cards'       // Request cards data
'create-card'     // Create new card
'delete-card'     // Delete existing card
'swipe-card'      // Card swipe action

// Client-side events
'cards'           // Receive cards data
'card-created'    // New card notification
'card-deleted'    // Card deletion notification
'card-swiped'     // Card swipe notification
'error'           // Error notification
```

### Event Flow
1. Client connects to Socket.io server
2. Server emits initial cards data
3. Real-time updates are broadcasted to all connected clients
4. Client updates UI based on received events

## Database Schema

### Card Model
```javascript
{
  text: String,        // Card content
  createdAt: Date,     // Creation timestamp
  archived: Boolean,   // Archive status
  swipes: [{
    direction: String, // 'left' or 'right'
    timestamp: Date    // Swipe timestamp
  }]
}
```

## UI Components

### Theme System
The application uses a comprehensive theme system:
- CSS Custom Properties for dynamic values
- TailwindCSS for utility classes
- Dark mode support
- Responsive breakpoints

### Animation System
Framer Motion is used for animations:
- Page transitions
- Card swipe animations
- Micro-interactions
- Loading states

## Development Guidelines

### Code Style
- ESLint configuration for code quality
- Prettier for code formatting
- TypeScript for type safety
- JSDoc comments for documentation

### Component Structure
```javascript
// Component template
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const ComponentName = ({ prop1, prop2 }) => {
  // State management
  const [state, setState] = useState(initial);

  // Side effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // Event logic
  };

  // Render
  return (
    <motion.div>
      {/* Component JSX */}
    </motion.div>
  );
};
```

### Testing Strategy
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows

## Deployment

### Vercel Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "NEXT_PUBLIC_SITE_URL": "@site-url"
  }
}
```

### Environment Variables
Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `NEXT_PUBLIC_SITE_URL`: Public site URL

## Performance Optimization

### Frontend Optimization
- Code splitting
- Image optimization
- CSS optimization
- Lazy loading

### Backend Optimization
- Database indexing
- Connection pooling
- Caching strategies
- Rate limiting

## Security Considerations

### API Security
- Input validation
- Rate limiting
- CORS configuration
- Error handling

### Database Security
- Connection string security
- Access control
- Data validation
- Sanitization

## Monitoring and Logging

### Error Tracking
- Console logging
- Error boundaries
- API error handling
- Socket error handling

### Performance Monitoring
- Page load times
- API response times
- Socket connection status
- Database performance

## Future Improvements

### Planned Features
- User authentication
- Analytics dashboard
- Advanced card management
- Performance optimizations

### Technical Debt
- Add comprehensive testing
- Implement TypeScript
- Optimize database queries
- Enhance error handling

## Troubleshooting

### Common Issues
1. Socket connection issues
   - Check server status
   - Verify connection configuration
   - Check network connectivity

2. Database connection issues
   - Verify MongoDB URI
   - Check network access
   - Validate credentials

3. Build issues
   - Clear `.next` directory
   - Update dependencies
   - Check environment variables

## Support and Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Socket.io Documentation](https://socket.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Framer Motion Documentation](https://www.framer.com/motion)

### Community
- GitHub Issues
- Discord Community
- Stack Overflow

