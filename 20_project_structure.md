# Project Structure [2025-05-24T03:04:04.789Z]

## Directory Structure

```
doneisbetter/
├── components/          # React components
│   ├── base/           # Base components
│   ├── feature/        # Feature-specific components
│   ├── features/       # Feature modules
│   │   ├── swipe/      # Swipe interface components
│   │   └── vote/       # Voting interface components
│   ├── layout/         # Layout components
│   │   ├── Header.js   # Main navigation header
│   │   ├── Layout.js   # Page layout wrapper
│   │   ├── MobileNav.js # Mobile navigation menu
│   │   └── Navigation.js # Alternative navigation
│   └── ui/             # Reusable UI components
│       ├── Button/     # Button components
│       ├── Card/       # Card components
│       └── Form/       # Form components
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   │   ├── cards/     # Card management
│   │   ├── vote/      # Voting endpoints
│   │   │   ├── pair.js   # Get card pairs for voting
│   │   │   ├── rankings.js # Get current rankings
│   │   │   └── submit.js # Submit vote results
│   ├── _app.js        # App wrapper
│   ├── index.js       # Home page
│   ├── swipe.js       # Swipe interface
│   ├── vote.js        # Vote interface
│   ├── rankings.js    # Rankings display
│   └── admin.js       # Admin panel
├── styles/            # Global styles
│   ├── globals.css    # Global CSS
│   └── theme.js       # Theme configuration
├── lib/               # Shared utilities
│   ├── db.js         # Database connection
│   └── polling.js    # HTTP polling setup
├── hooks/             # Custom React hooks
│   ├── usePolling.js # Polling hook
│   └── useTheme.js   # Theme hook
├── models/            # Database models
│   ├── Card.js       # Card model
│   ├── VotePair.js   # Vote pair model
│   └── VoteRank.js   # Card ranking model
└── public/            # Static assets
```

## Documentation Structure

```
doneisbetter/
├── 00_documentation_index.md          # Documentation directory
├── 01_roadmap.md                      # Project roadmap and phases
├── 02_Technology_Stack.md             # Technical implementation details
├── 03_AI_Consent_Permissions.md       # AI usage guidelines
├── 04_releasenotes.md                # Version history and changes
├── 05_Definition_of_Done.md           # Quality standards
├── 06_Sequential_Development_Rule.md  # Development process
├── 07_AI_Knowledge_Rules.md           # AI integration guidelines
├── 08_AI_Verification_Protocol.md     # Testing and verification
├── 09_Dev_Log_Lesson_Learned.md       # Development insights
├── 10_ai_plan.md                      # AI implementation plan
├── 11_documentation_update.md         # Documentation maintenance log
├── 12_deployment_log.md               # Deployment tracking
├── 13_final_status.md                 # Status reports
├── 14_license_and_guidelines.md       # License and usage
├── 15_architecture_and_design.md      # System architecture
├── 16_code_of_conduct.md              # Community guidelines
├── 17_contributing_guidelines.md      # Contribution rules
├── 18_deployment_guidelines.md        # Deployment process
├── 19_monitoring_setup.md             # System monitoring
├── 20_project_structure.md            # Codebase organization
├── 21_security_guidelines.md          # Security practices
├── 22_testing_guidelines.md           # Testing standards
├── 23_final_completion.md             # Project completion status
└── 24_system_documentation.md         # Comprehensive system manual
```

## Component Organization

### Feature Components
- Self-contained features
- Business logic
- State management
- Event handling

### Layout Components
- Page structure
- Navigation system
  - Header.js (Desktop navigation with emojis)
  - MobileNav.js (Mobile-optimized navigation)
  - Navigation.js (Alternative navigation component)
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
- Theme (dark/light mode)
- User preferences
- HTTP polling state
- Authentication
- Rankings state

## API Organization

### Route Structure
```javascript
// API route (cards.js)
export default async function handler(req, res) {
  // Route implementation
}
```

### HTTP Polling
```javascript
// Polling setup
const fetchData = async () => {
  const response = await fetch('/api/data');
  return response.json();
};

// Polling interval
useEffect(() => {
  const interval = setInterval(fetchData, POLLING_INTERVAL);
  return () => clearInterval(interval);
}, []);
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

## Documentation Standards

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

### Navigation Components
```javascript
// Header.js - Desktop navigation
const navigationItems = [
  { href: "/", label: "Home 🏠" },
  { href: "/rankings", label: "Rankings 🏆" },
  { href: "/swipe", label: "Swipe 🔄" },
  { href: "/vote", label: "Vote 🗳️" },
  { href: "/admin", label: "Admin ⚙️" }
];
```

### Documentation Timestamp Format
```markdown
# Document Title [2025-05-24T03:04:04.789Z]

## Section

Content...

## Version History
- Initial document: 2025-05-22T10:45:32.789Z
- Updated with new feature: 2025-05-24T03:04:04.789Z
```

## Version Control

- Documentation Version: 1.1.0
- Last Updated: 2025-05-24T03:04:04.789Z
- Update Frequency: With structural changes

## Related Documentation
- [15_architecture_and_design.md](15_architecture_and_design.md)
- [22_testing_guidelines.md](22_testing_guidelines.md)
- [17_contributing_guidelines.md](17_contributing_guidelines.md)
- [24_system_documentation.md](24_system_documentation.md)

## Version History
- Initial structure documentation: 2025-05-22T10:45:32.789Z
- Updated with navigation components, documentation standards, and models: 2025-05-24T03:04:04.789Z

