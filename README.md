# CardSwipe

A privacy-focused image ranking application that allows users to discover and rank images through an intuitive swipe and vote interface.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

## Overview

CardSwipe presents public image URLs from imgbb.com as swipeable cards, enabling users to:
1. **SWIPE** through images (like/dislike)
2. **VOTE** in 1v1 preference battles
3. View final **RANKING**

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to start using the application.

## SSO Integration

CardSwipe uses SSO authentication from sso.doneisbetter.com. Configure your environment:

```env
SSO_API_URL=https://sso.doneisbetter.com
SSO_CLIENT_ID=your_client_id
SSO_CLIENT_SECRET=your_client_secret
```

See [SSO Integration Guide](https://sso.doneisbetter.com/docs/integration) for detailed setup.

## Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Development Roadmap](ROADMAP.md)
- [Task List](TASKLIST.md)
- [Release Notes](RELEASE_NOTES.md)
- [Project Learnings](LEARNINGS.md)

## License

© 2025 CardSwipe. All rights reserved.
