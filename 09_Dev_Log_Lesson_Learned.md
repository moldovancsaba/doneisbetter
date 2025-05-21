# 09_DEV_LOG_LESSON_LEARNED.md — DONEISBETTER

## 📓 Purpose

This file documents all key learnings, unexpected obstacles, and workflow adjustments discovered during the development of the *doneisbetter* project. It must be kept up-to-date throughout the lifecycle of the project.

---

## 🗓️ DEV LOG ENTRIES

---

### 📅 YYYY-MM-DD — Initial Documentation Baseline

**What was done:**  
Created full set of `.md` documentation based on user-uploaded strict templates. Introduced structural standardization and AI validation rules.

**Lesson learned:**  
Even simple prototypes benefit greatly from structured rules. Early documentation clarity avoids ambiguity in later phases.

---

### 📅 2025-05-21 — Core Navigation and API Implementation

**What was done:**  
1. Added main page navigation with SWIPE and ADMIN buttons using Next.js Link component
2. Created API endpoint for cards with proper CRUD operations
3. Fixed MongoDB connection issues
4. Resolved duplicate code errors in API implementation
5. Updated swipe page to handle loading states, errors, and navigate through cards

**Lesson learned:**  
1. Environment variable naming is critical - we had MONGODB_URI in .env.local but were looking for MONGO_URI in the code
2. Next.js compilation errors for duplicate code can be hard to spot - when implementing APIs, be careful not to duplicate handler functions
3. Error handling is essential at every level: API requests, database connections, and UI feedback
4. Always check for existing implementations before creating new ones to avoid duplication
5. "Done is Better Than Perfect" approach allowed us to quickly make progress by prioritizing working functionality over extensive features

---

## ✏️ Logging Rules

- Every completed task **must** generate a corresponding dev log entry
- Entries must be **factual, brief, and outcome-oriented**
- No vague entries (“some tests done”, “it worked ok”) allowed
- Clearly distinguish between action and insight

---

## 🔁 Template for New Entries

```md
### 📅 YYYY-MM-DD — [Short Title]

**What was done:**  
Describe the task or milestone completed.

**Lesson learned:**  
What insight was gained, what failed, what should be changed in the future?
```

---

## 📌 This log is part of the Definition of Done.

Failure to update this log when tasks are completed invalidates completion status.
