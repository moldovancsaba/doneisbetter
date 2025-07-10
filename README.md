# CardSwipe

A simple card management and ranking application with an intuitive swipe interface.

![Version](https://img.shields.io/badge/version-7.0.0-blue.svg)

## Overview

CardSwipe is a straightforward card management system that lets you create, organize, and rank cards through an easy-to-use interface.

### Features
- **Card Management**: Create and edit cards with titles and descriptions
- **Simple Ranking**: Swipe to rank cards
- **Basic Filtering**: Search and sort cards
- **Personal Rankings**: Track your card preferences
- **Grid Layout**: Responsive grid display for ranked cards
- **Image Optimization**: Automatic aspect ratio preservation and responsive sizing

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3003` to start using the application.

## Project Structure

- `/src/app` - Next.js pages and layouts
- `/src/components` - React components
  - `/common/Card` - Core card component and related utilities
  - `RankingGrid.tsx` - Grid layout for ranked cards
- `/src/models` - MongoDB models
- `/src/types` - TypeScript types

## Technical Stack

- Next.js
- TypeScript
- MongoDB
- TailwindCSS

## Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Development Roadmap](ROADMAP.md)
- [Task List](TASKLIST.md)
- [Release Notes](RELEASE_NOTES.md)
- [Project Learnings](LEARNINGS.md)

## License

© 2025 CardSwipe. All rights reserved.
