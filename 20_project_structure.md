# Project Structure [2025-05-22T10:45:32.646035+02:00]

## Directory Structure

```
doneisbetter/
├── components/          # React components
│   ├── features/       # Feature-specific components
│   │   ├── CardStack/  # Card swiping feature
│   │   └── Admin/      # Admin interface
│   ├── layout/         # Layout components
│   │   ├── Header/     # Navigation header
│   │   └── Footer/     # Page footer
│   └── ui/             # Reusable UI components
│       ├── Button/     # Button components
│       ├── Card/       # Card components
│       └── Form/       # Form components
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   │   ├── cards/     # Card management
│   │   └── socketio/  # Socket.io endpoint
│   ├── _app.js        # App wrapper
│   ├── index.js       # Home page
│   ├── swipe.js       # Swipe interface
│   └── admin.js       # Admin panel
├── styles/            # Global styles
│   ├── globals.css    # Global CSS
│   └── theme.js       # Theme configuration
├── lib/               # Shared utilities
│   ├── db.js         # Database connection
│   └── socket.js     # Socket.io setup
├── hooks/             # Custom React hooks
│   ├── useSocket.js  # Socket hook
│   └── useTheme.js   # Theme hook
└── public/            # Static assets
```

## Component Organization

### Feature Components
- Self-contained features
- Business logic
- State management
- Event handling

### Layout Components
- Page structure
- Navigation
- Common layouts
- Responsive design

### UI Components
- Reusable elements
- Styling consistency
- Accessibility
- Documentation

## File Naming Conventions

### Components
```javascript
// Component file (Button.js)
export const Button = () => {
  // Component implementation
};

// Index file (index.js)
export * from './Button';
```

### Pages
```javascript
// Page file (swipe.js)
export default function SwipePage() {
  // Page implementation
}
```

### Utilities
```javascript
// Utility file (db.js)
export const connect = () => {
  // Implementation
};
```

## Code Organization

### Component Structure
```javascript
// Import statements
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Component definition
export const Component = () => {
  // State management
  // Event handlers
  // Side effects
  // Render
};
```

### Page Structure
```javascript
// Import statements
import { Layout } from '../components/layout';
import { useSocket } from '../hooks/useSocket';

// Page component
export default function Page() {
  // Page implementation
}
```

## State Management

### Local State
- Component state
- Form state
- UI state
- Animations

### Global State
- Theme
- User preferences
- Socket connection
- Authentication

## API Organization

### Route Structure
```javascript
// API route (cards.js)
export default async function handler(req, res) {
  // Route implementation
}
```

### Socket Events
```javascript
// Socket events
socket.on('connection', () => {
  // Event handlers
});
```

## Style Organization

### CSS Modules
```css
/* Component styles */
.container {
  /* styles */
}
```

### Global Styles
```css
/* Global styles */
:root {
  /* CSS variables */
}
```

## Testing Structure

### Test Files
```javascript
// Component test
describe('Component', () => {
  // Test cases
});
```

### Test Utils
```javascript
// Test utilities
export const renderWithTheme = () => {
  // Implementation
};
```

## Documentation Structure

### Component Documentation
```javascript
/**
 * Component description
 * @param {object} props - Component props
 * @returns {ReactElement} Component
 */
```

### API Documentation
```javascript
/**
 * API endpoint description
 * @param {object} req - Request object
 * @param {object} res - Response object
 */
```

## Version Control

- Documentation Version: 1.0.0
- Last Updated: 2025-05-22T10:45:32.646035+02:00
- Update Frequency: With structural changes

## Related Documentation
- [15_architecture_and_design.md](15_architecture_and_design.md)
- [22_testing_guidelines.md](22_testing_guidelines.md)
- [17_contributing_guidelines.md](17_contributing_guidelines.md)

