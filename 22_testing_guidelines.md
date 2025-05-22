# Testing Guidelines [2025-05-22T10:45:32.646035+02:00]

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
   - Socket connections
   - Feature workflows

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
// useSocket.test.js
import { renderHook } from '@testing-library/react-hooks';
import { useSocket } from './useSocket';

describe('useSocket', () => {
  it('connects to socket server', () => {
    const { result } = renderHook(() => useSocket());
    expect(result.current.connected).toBe(true);
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

### Socket Testing
```javascript
// socket.test.js
import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';

describe('Socket.io', () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('should work', (done) => {
    clientSocket.on('hello', (arg) => {
      expect(arg).toBe('world');
      done();
    });
    serverSocket.emit('hello', 'world');
  });
});
```

## E2E Testing

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

- Documentation Version: 1.0.0
- Last Updated: 2025-05-22T10:45:32.646035+02:00
- Update Frequency: With testing changes

## Related Documentation
- [17_contributing_guidelines.md](17_contributing_guidelines.md)
- [15_architecture_and_design.md](15_architecture_and_design.md)
- [21_security_guidelines.md](21_security_guidelines.md)

