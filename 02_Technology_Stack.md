# 02_TECHNOLOGY_STACK.md — DONEISBETTER [2025-05-24T02:52:45.789Z]

## 📦 Additional Components

| Component          | Purpose                               | Implementation Details                   |
|---------------------|---------------------------------------|------------------------------------------|
| ELO-Inspired Ranking| Dynamic card ranking algorithm       | Custom implementation in API routes      |
| Navigation System   | Multi-view navigation with emojis    | Desktop and mobile-optimized components  |
| Theme Switching     | Dark/light mode toggle               | Using next-themes with local storage     |
| Vote Tracking       | Session-based vote persistence       | MongoDB collections with session IDs     |

## 📝 Version History

- Initial documentation: 2025-05-10
- Updated with HTTP Polling: 2025-05-23
- Updated with additional components: 2025-05-24T02:52:45.789Z
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
