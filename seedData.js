const sampleUsers = [
  {
    email: 'admin@test.com',
    password: 'hashedPassword123',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2025-04-13T12:34:56.789Z'
  },
  {
    email: 'user@test.com',
    password: 'hashedPassword456',
    name: 'Test User',
    role: 'user',
    createdAt: '2025-04-13T12:34:56.789Z'
  }
];

const sampleCards = [
  {
    title: 'Implement User Authentication',
    description: 'Set up JWT-based authentication system',
    priority: 'high',
    status: 'todo',
    createdAt: '2025-04-13T12:34:56.789Z',
    createdBy: 'admin@test.com'
  },
  {
    title: 'Design Database Schema',
    description: 'Create initial database models and relationships',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2025-04-13T12:34:56.789Z',
    createdBy: 'admin@test.com'
  },
  {
    title: 'Setup Email Notifications',
    description: 'Implement email notification system for updates',
    priority: 'medium',
    status: 'todo',
    createdAt: '2025-04-13T12:34:56.789Z',
    createdBy: 'user@test.com'
  },
  {
    title: 'Create Admin Dashboard',
    description: 'Build administrative interface for user management',
    priority: 'medium',
    status: 'todo',
    createdAt: '2025-04-13T12:34:56.789Z',
    createdBy: 'admin@test.com'
  },
  {
    title: 'Implement Error Logging',
    description: 'Set up error tracking and monitoring',
    priority: 'low',
    status: 'todo',
    createdAt: '2025-04-13T12:34:56.789Z',
    createdBy: 'user@test.com'
  },
  {
    title: 'Mobile Responsive Design',
    description: 'Ensure all pages work well on mobile devices',
    priority: 'high',
    status: 'todo',
    createdAt: '2025-04-13T12:34:56.789Z',
    createdBy: 'user@test.com'
  }
];

const sampleVotes = [
  {
    // Authentication vs Database Schema
    winningCardId: sampleCards[0].id,
    losingCardId: sampleCards[1].id,
    votedBy: sampleUsers[0].email,
    createdAt: '2025-04-13T12:34:56.789Z'
  },
  {
    // Mobile Responsive vs Email Notifications
    winningCardId: sampleCards[5].id,
    losingCardId: sampleCards[2].id,
    votedBy: sampleUsers[1].email,
    createdAt: '2025-04-13T12:34:56.789Z'
  },
  {
    // Authentication vs Admin Dashboard
    winningCardId: sampleCards[0].id,
    losingCardId: sampleCards[3].id,
    votedBy: sampleUsers[0].email,
    createdAt: '2025-04-13T12:34:56.789Z'
  },
  {
    // Database Schema vs Error Logging
    winningCardId: sampleCards[1].id,
    losingCardId: sampleCards[4].id,
    votedBy: sampleUsers[1].email,
    createdAt: '2025-04-13T12:34:56.789Z'
  }
];

module.exports = {
  sampleUsers,
  sampleCards,
  sampleVotes
};

