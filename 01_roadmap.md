# 01_ROADMAP.md — DONEISBETTER

## 📍 Current Phase: Prototype Implementation

This roadmap outlines the strict, incremental steps required to complete the doneisbetter prototype according to the “Done is Better Than Perfect” philosophy. All tasks are performed **sequentially**, must be tested independently, and deployed on **Vercel Production** after each step.

---

## 🔄 Phase Structure

Each phase must be:
- Fully implemented
- Tested locally
- Committed to GitHub
- Deployed on Vercel
- Documented and verifiable

---

## ✅ Phase 1 – Project Initialization

| Task                                    | Status  |
|-----------------------------------------|---------|
| Define project purpose and architecture | ✅ Done |
| Set up GitHub repositories              | ✅ Done |
| Set up Vercel for frontend & backend    | ✅ Done |
| Create core documentation (.md files)   | ✅ Done |

---

## 🚧 Phase 2 – Admin Panel

| Task                                      | Status |
|-------------------------------------------|--------|
| Create MongoDB schema for cards           | ⏳      |
| Build API route to add/delete cards       | ⏳      |
| Develop minimal admin UI                  | ⏳      |
| Connect admin UI to backend               | ⏳      |
| Deploy tested admin interface to Vercel   | ⏳      |

---

## 🚧 Phase 3 – Swipe Interface

| Task                                          | Status |
|-----------------------------------------------|--------|
| Fetch cards from MongoDB Atlas via API        | ⏳      |
| Render swipeable cards                        | ⏳      |
| Implement swipe gestures (left/right)         | ⏳      |
| Ensure text resizes to fit cards              | ⏳      |
| Display “Thank you” card when stack is empty  | ⏳      |
| Deploy functional swipe UI to Vercel          | ⏳      |

---

## 🚧 Phase 4 – System Integration & Polishing

| Task                                              | Status |
|---------------------------------------------------|--------|
| Ensure Socket.io connection is stable             | ⏳      |
| Implement real-time sync (optional for v1)        | ⏳      |
| Text layout edge-case testing                     | ⏳      |
| Final test in mobile and desktop environments     | ⏳      |
| Final Vercel production deployment                | ⏳      |

---

## 📘 Notes

- Each phase is delivered independently and verified via deployment.
- Card data is manually tested.
- Deployment is strictly tied to GitHub commits.
- Admin and User sides are developed in parallel only after backend is stable.
