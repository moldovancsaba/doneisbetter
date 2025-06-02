# Technology Stack Documentation

Last Updated: 2025-06-02T00:01:20Z

## Core Technologies

### Frontend
- **Next.js** (v15.3.3)
  - React (v18.2.0)
  - React DOM (v18.2.0)
- **Styling**
  - TailwindCSS (v3.4.1)
  - @tailwindcss/forms (v0.5.7)

### Backend
- **Database**
  - MongoDB with Mongoose (v8.1.1)
- **API**
  - Next.js API Routes
  - Zod (v3.22.4) for schema validation

### Development Tools
- **Type Checking & Linting**
  - TypeScript with @typescript-eslint/parser (v6.21.0)
  - ESLint (v8.57.0)
  - eslint-config-next (v14.2.29)

### UI/UX Components
- **Animation**
  - Framer Motion (v11.0.3)
- **Icons**
  - @fortawesome/react-fontawesome (v0.2.0)
  - @fortawesome/free-solid-svg-icons (v6.5.1)

### Utilities
- **Environment**
  - dotenv (v16.4.1)
- **Build Tools**
  - PostCSS (v8.4.35)
  - Autoprefixer (v10.4.17)
- **Other**
  - UUID (v9.0.1) for unique identifiers
  - next-themes (v0.2.1) for theme management

## Module System
- Using ES Modules (type: "module" in package.json)

## Scripts
- `npm run dev`: Start development server
- `npm run build`: Build production bundle
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run reset-db`: Reset database (development only)

## ESLint Configuration
```json
{
  "extends": "next",
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "root": true
}
```

## Important Notes
- Project is configured for TypeScript support
- Strict ESLint rules are enforced through Next.js configuration
- TailwindCSS is used for all styling with custom configuration
- MongoDB is the primary database
- All timestamps follow ISO 8601 format (e.g., 2025-06-02T00:01:20Z)

# 02_TECHNOLOGY_STACK.md — DONEISBETTER [2025-05-31T16:33:14.000Z]

## 📦 Additional Components

| Component          | Purpose                               | Implementation Details                   |
|---------------------|---------------------------------------|------------------------------------------|
| ELO-Inspired Ranking| Dynamic card ranking algorithm       | Custom implementation in API routes      |
| Navigation System   | Unified navigation with emoji menu   | Responsive desktop/mobile components    |
| Theme Switching     | Dark/light mode toggle               | Using next-themes with local storage     |
| Vote Tracking       | Session-based vote persistence       | MongoDB collections with session IDs     |

## 📝 Version History

- Initial documentation: 2025-05-10T00:00:00.000Z
- Updated with HTTP Polling: 2025-05-23T00:00:00.000Z
- Updated with additional components: 2025-05-24T02:52:45.789Z
- Updated with unified navigation system: 2025-05-31T16:33:14.000Z
## 🔒 No Substitutions Allowed

The tech stack below is **mandatory and locked** for all development. No external tools, plugins, or services are permitted beyond those listed.

---

## 🖥️ Frontend

| Component       | Technology     | Notes                                                 |
|------------------|----------------|--------------------------------------------------------|
| Framework        | Next.js        | Required — latest stable version                       |
| UI Styling       | Tailwind CSS   | Mobile-first; supports dark/light mode toggle          |
| State Handling   | Native React   | No Redux or external state managers allowed            |
| Real-Time Sync   | HTTP Polling   | Replaced Socket.io as per Phase 5 improvements         |

---

## 🧠 Backend

| Component         | Technology     | Notes                                                   |
|-------------------|----------------|----------------------------------------------------------|
| Framework         | Next.js API    | Serverless backend within the same codebase             |
| DB Connection     | Mongoose       | ODM for MongoDB Atlas                                   |
| Realtime Layer    | HTTP Polling   | Updates fetched on interval for better reliability      |
| Card Logic        | Custom Logic   | Cards delivered via filtered API                       |

---

## 🗄️ Database

| Component     | Technology   | Notes                                               |
|----------------|--------------|------------------------------------------------------|
| DB Engine      | MongoDB Atlas| One database shared between all environments        |
| Access Layer   | Mongoose     | Models, validation, indexing handled here           |
| Deployment     | Cloud Atlas  | URI set in Vercel project environment settings       |

---

## ☁️ Hosting & CI/CD

| Component          | Technology   | Notes                                                           |
|---------------------|--------------|------------------------------------------------------------------|
| Hosting             | Vercel       | Used for both frontend and backend deployment                   |
| Environment Config  | Vercel UI    | Secrets and URIs defined per environment                        |
| Version Control     | GitHub       | Branches: `DEV`, `STAGING`, `PROD`                              |
| Deployment Rules    | GitHub ↔ Vercel | Auto-deploy from `main` branch to Production                   |

---

## 🚫 Not Allowed

- ❌ Firebase
- ❌ Redux
- ❌ Express
- ❌ Third-party UI kits (Chakra, MUI, etc.)
- ❌ External analytics or data tracking
