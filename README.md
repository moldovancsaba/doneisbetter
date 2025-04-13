# Done Is Better ✍️

A minimalist text card application with MongoDB integration.

**Status**: 🟢 Working Drag-and-Drop Kanban Implemented
**Version**: v0.8.2
**Live**: [doneisbetter-aeidmp1k2-narimato.vercel.app](https://doneisbetter-aeidmp1k2-narimato.vercel.app)

## Quick Start

```bash
git clone https://github.com/moldovancsaba/doneisbetter.git
cd doneisbetter
npm install
npm run dev
```

## Project Structure

- `src/app/`: Next.js application core
  - `layout.js` - Root layout
  - `page.js` - Main application entry point
  - `actions.js` - Server Actions for database operations
  - `globals.css` - Global styles
- `src/components/`: React components
    - `KanbanBoard.js` - Main board logic (Client)
    - `Column.js` - Column rendering (Client)
    - `CardItem.js` - Individual card item (Client)
    - `Input.js` - New card input (Client)
- `src/lib/`: Utility functions
    - `db.js` - MongoDB connection helper
- `docs/`: Project documentation (Roadmap, Dev Diary, Release Notes, etc.)
- `public/`: Static assets
- `package.json`: Dependencies and scripts
- `next.config.js`: Next.js configuration
- `postcss.config.js`: PostCSS configuration

## Tech Stack

- Next.js 15.3.0 (App Router)
- React 19
- MongoDB with Mongoose
- `@hello-pangea/dnd` for Drag-and-Drop
- CSS Modules / Global CSS
- Vercel Deployment
- Git Version Control

## Documentation

### Project Documentation
- [Development Timeline](docs/05_50FirstDates.MD)
- [Release History](docs/04_releasenotes.MD)
- [Implementation Insights](docs/03_lessonslearned.MD)
- [Project Roadmap](docs/01_roadmap.MD)
- [Technical Details](docs/06_technology.MD)

### AI Development Guidelines
- [Definition of Done](docs/07_Definition_of_Done_AI_Warp.MD)
- [One Function Rule](docs/08_One_Function_At_A_Time_Rule.MD)
- [Autopilot Consent](docs/09_Autopilot_Consent_Project_Access.MD)
- [AI Knowledge Rules](docs/10_AI_Knowledge_Rules.MD)
- [AI Truthfulness](docs/11_AI_Truthfulness_and_Verification.MD)
- [Execution Protocol](docs/12_AI_Execution_Protocol.MD)

## Features

- Single line input field with focus states.
- Enter to submit new cards.
- Cards stored persistently in MongoDB.
- 3-column Kanban layout ('Deleted', 'Active', 'Done').
- Drag-and-Drop cards between columns (updates status persistently).
- Drag-and-Drop cards within columns to reorder (updates order persistently).
- Timestamps displayed in UTC ISO 8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- Basic Dark Mode support.

## Known Limitations

- Requires MongoDB connection string in `.env.local` or Vercel environment variables.
- Basic styling (functional, not heavily designed).
- Reversal logic for failed optimistic updates is basic.
- Order persistence is not updated when moving cards *between* columns (only status is updated).

# Done Is Better ✍️

A minimalist text card application with MongoDB integration.

**Status**: 🟢 Working Drag-and-Drop Kanban Implemented
**Version**: v0.8.2
**Live**: [doneisbetter-aeidmp1k2-narimato.vercel.app](https://doneisbetter-aeidmp1k2-narimato.vercel.app)

## Quick Start

```bash
git clone https://github.com/moldovancsaba/doneisbetter.git
cd doneisbetter
npm install
npm run dev
```

## Project Structure

- `src/app/`: Next.js application core
  - `layout.js` - Root layout
  - `page.js` - Main application entry point
  - `actions.js` - Server Actions for database operations
  - `globals.css` - Global styles
- `src/components/`: React components
    - `KanbanBoard.js` - Main board logic (Client)
    - `Column.js` - Column rendering (Client)
    - `CardItem.js` - Individual card item (Client)
    - `Input.js` - New card input (Client)
- `src/lib/`: Utility functions
    - `db.js` - MongoDB connection helper
- `docs/`: Project documentation (Roadmap, Dev Diary, Release Notes, etc.)
- `public/`: Static assets
- `package.json`: Dependencies and scripts
- `next.config.js`: Next.js configuration
- `postcss.config.js`: PostCSS configuration

## Tech Stack

- Next.js 15.3.0 (App Router)
- React 19
- MongoDB with Mongoose
- `@hello-pangea/dnd` for Drag-and-Drop
- CSS Modules / Global CSS
- Vercel Deployment
- Git Version Control

## Documentation

### Project Documentation
- [Development Timeline](docs/05_50FirstDates.MD)
- [Release History](docs/04_releasenotes.MD)
- [Implementation Insights](docs/03_lessonslearned.MD)
- [Project Roadmap](docs/01_roadmap.MD)
- [Technical Details](docs/06_technology.MD)

### AI Development Guidelines
- [Definition of Done](docs/07_Definition_of_Done_AI_Warp.MD)
- [One Function Rule](docs/08_One_Function_At_A_Time_Rule.MD)
- [Autopilot Consent](docs/09_Autopilot_Consent_Project_Access.MD)
- [AI Knowledge Rules](docs/10_AI_Knowledge_Rules.MD)
- [AI Truthfulness](docs/11_AI_Truthfulness_and_Verification.MD)
- [Execution Protocol](docs/12_AI_Execution_Protocol.MD)

## Features

- Single line input field with focus states.
- Enter to submit new cards.
- Cards stored persistently in MongoDB.
- 3-column Kanban layout ('Deleted', 'Active', 'Done').
- Drag-and-Drop cards between columns (updates status persistently).
- Drag-and-Drop cards within columns to reorder (updates order persistently).
- Timestamps displayed in UTC ISO 8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- Basic Dark Mode support.

## Known Limitations

- Requires MongoDB connection string in `.env.local` or Vercel environment variables.
- Basic styling (functional, not heavily designed).
- Reversal logic for failed optimistic updates is basic.
- Order persistence is not updated when moving cards *between* columns (only status is updated).
