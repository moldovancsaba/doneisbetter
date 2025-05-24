# Testing Guidelines [2025-05-24T03:04:04.789Z]

## Overview

This document outlines testing practices and requirements for the DoneisBetter project, ensuring code quality and reliability.

## Testing Architecture

### Test Types
1. Unit Tests
   - Component tests
   - Utility function tests
   - Hook tests
   - Service tests

2. Integration Tests
   - API endpoints
   - Database operations
   - HTTP polling
   - Feature workflows
   - Cross-component consistency

3. End-to-End Tests
   - User journeys
   - Cross-browser testing
   - Mobile testing
   - Performance testing

## Test Setup

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1'
  }
};
```

### Testing Utilities
```javascript
// test-utils.js
import { render } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';

export const renderWithTheme = (ui) => {
  return render(
    <ThemeProvider attribute="class">
      {ui}
    </ThemeProvider>
  );
};
```

## Component Testing

### React Components
```javascript
// Button.test.js
import { render, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Button onClick={onClick}>Click me</Button>
    );
    fireEvent.click(getByText('Click me'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Hook Testing
```javascript
// usePolling.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { usePolling } from './usePolling';

describe('usePolling', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fetches data at regular intervals', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });
    const { result } = renderHook(() => usePolling(mockFetch, 5000));
    
    expect(mockFetch).toHaveBeenCalledTimes(1); // Initial fetch
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(mockFetch).toHaveBeenCalledTimes(2); // After interval
  });
});
```

## API Testing

### Endpoint Tests
```javascript
// cards.test.js
import { createMocks } from 'node-mocks-http';
import handler from './cards';

describe('/api/cards', () => {
  it('creates a card', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { text: 'Test card' }
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(201);
  });
});
```

### HTTP Polling Testing
```javascript
// polling.test.js
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderHook, act } from '@testing-library/react-hooks';
import { usePolling } from '../hooks/usePolling';

// Mock API server
const server = setupServer(
  rest.get('/api/data', (req, res, ctx) => {
    return res(ctx.json({ data: 'test' }));
  })
);

describe('HTTP Polling', () => {
  // Setup mock server
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('polling fetches updated data', async () => {
    // Initial data
    server.use(
      rest.get('/api/data', (req, res, ctx) => {
        return res(ctx.json({ data: 'initial'});
```

### Navigation Component Testing
```javascript
// navigation.test.js
import { render, screen } from '@testing-library/react';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';
import { Navigation } from '../components/layout/Navigation';

describe('Navigation Consistency', () => {
  const expectedItems = [
    { href: "/", label: "Home 🏠" },
    { href: "/rankings", label: "Rankings 🏆" },
    { href: "/swipe", label: "Swipe 🔄" },
    { href: "/vote", label: "Vote 🗳️" },
    { href: "/admin", label: "Admin ⚙️" }
  ];

  test('Hea## E2E Testing

### Cypress Setup
```javascript
// cypress.config.js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js'
  }
};
```

### User Journey Tests
```javascript
// swipe.cy.js
describe('Swipe Feature', () => {
  beforeEach(() => {
    cy.visit('/swipe');
  });

  it('allows card swiping', () => {
    cy.get('[data-testid="card"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 500 })
      .trigger('mouseup');
  });
});

// navigation.cy.js
describe('Navigation System', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('has consistent navigation items across viewports', () => {
    // Check desktop navigation
    cy.viewport(1200, 800);
    cy.get('header nav a').should('have.length', 5);
    cy.get('header nav a').eq(0).should('contain', 'Home 🏠');
    cy.get('header nav a').eq(1).should('contain', 'Rankings 🏆');
    
    // Check mobile navigation
    cy.viewport(375, 667);
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('.mobileNav a').should('have.length', 5);
    cy.get('.mobileNav a').eq(0).should('contain', 'Home 🏠');
    cy.get('.mobileNav a').eq(1).should('contain', 'Rankings 🏆');
  });
  
  it('navigates correctly between pages', () => {
    // Test navigation to different pages
    cy.get('header nav a').contains('Rankings').click();
    cy.url().should('include', '/rankings');
    
    cy.get('header nav a').contains('Swipe').click();
    cy.url().should('include', '/swipe');
    
    cy.get('header nav a').contains('Vote').click();
    cy.url().should('include', '/vote');
  });
});
```

## Performance Testing

### Metrics
1. Load Time
   - First paint
   - First contentful paint
   - Time to interactive

2. Runtime Performance
   - Memory usage
   - CPU utilization
   - Network requests

### Lighthouse Tests
```javascript
// lighthouse.test.js
describe('Lighthouse', () => {
  it('passes performance audit', async () => {
    const result = await lighthouse('http://localhost:3000');
    expect(result.performance).toBeGreaterThan(90);
  });
});

// timestamp-formatting.test.js
describe('Timestamp Formatting', () => {
  it('validates ISO 8601 timestamp format', () => {
    const validateTimestamp = (timestamp) => {
      const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      return regex.test(timestamp);
    };
    
    // Valid timestamps
    expect(validateTimestamp('2025-05-24T03:04:04.789Z')).toBe(true);
    
    // Invalid timestamps
    expect(validateTimestamp('2025-05-24')).toBe(false);
    expect(validateTimestamp('2025-05-24T03:04:04+02:00')).toBe(false);
    expect(validateTimestamp('2025-05-24T03:04:04.933652+02:00')).toBe(false);
  });
});
```

## Testing Standards

### Code Coverage
```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Test Organization
1. File Structure
   - __tests__ directory
   - .test.js suffix
   - Parallel structure
   - Shared utilities

2. Naming Conventions
   - Descriptive names
   - Feature grouping
   - Clear purpose
   - Consistent format

## Version Control

- Documentation Version: 1.1.0
- Last Updated: 2025-05-24T03:04:04.789Z
- Update Frequency: With testing changes

## Related Documentation
- [17_contributing_guidelines.md](17_contributing_guidelines.md)
- [15_architecture_and_design.md](15_architecture_and_design.md)
- [21_security_guidelines.md](21_security_guidelines.md)
- [24_system_documentation.md](24_system_documentation.md)

## Navigation Testing Checklist

- [ ] Verify all navigation components contain required menu items
- [ ] Test emoji rendering in all browsers and devices
- [ ] Confirm consistent menu order across all components
- [ ] Test navigation item functionality (links to correct pages)
- [ ] Verify mobile navigation responsiveness
- [ ] Test keyboard navigation accessibility
- [ ] Verify dark/light mode toggle functions correctly

## Documentation Testing Checklist

- [ ] Validate all timestamps follow ISO 8601 format with milliseconds
- [ ] Confirm all documentation files have proper version history
- [ ] Verify cross-references between documentation files
- [ ] Test system documentation alignment with actual implementation
- [ ] Verify navigation documentation matches actual components

## Version History
- Initial testing guidelines: 2025-05-22T10:45:32.789Z
- Updated with navigation testing, documentation testing, and HTTP polling: 2025-05-24T03:04:04.789Z

