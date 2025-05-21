# 02_TECHNOLOGY_STACK.md — DONEISBETTER

## 🔒 No Substitutions Allowed

The tech stack below is **mandatory and locked** for all development. No external tools, plugins, or services are permitted beyond those listed.

---

## 🖥️ Frontend

| Component       | Technology     | Notes                                                 |
|------------------|----------------|--------------------------------------------------------|
| Framework        | Next.js        | Required — latest stable version                       |
| UI Styling       | Tailwind CSS   | Mobile-first; supports dark/light mode toggle          |
| State Handling   | Native React   | No Redux or external state managers allowed            |
| Real-Time Sync   | Socket.io      | For card sync and future user interactions             |

---

## 🧠 Backend

| Component         | Technology     | Notes                                                   |
|-------------------|----------------|----------------------------------------------------------|
| Framework         | Next.js API    | Serverless backend within the same codebase             |
| DB Connection     | Mongoose       | ODM for MongoDB Atlas                                   |
| Realtime Layer    | Socket.io      | All updates must be visible in real time                |
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
