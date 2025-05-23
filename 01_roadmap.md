# 01_ROADMAP.md — DONEISBETTER

## 📍 Current Phase: Enhanced User Experience & UI Improvements

This roadmap outlines the strict, incremental steps required to complete the doneisbetter prototype according to the "Done is Better Than Perfect" philosophy. All tasks are performed **sequentially**, must be tested independently, and deployed on **Vercel Production** after each step.

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

## 🔄 Phase 2 – Admin Panel

| Task                                      | Status      |
|-------------------------------------------|-------------|
| Create MongoDB schema for cards           | ✅ Done     |
| Build API route to add/delete cards       | ✅ Done     |
| Develop minimal admin UI                  | ✅ Done     |
| Connect admin UI to backend               | ✅ Done     |
| Deploy tested admin interface to Vercel   | ✅ Done     |

---

## 🔄 Phase 3 – Swipe Interface

| Task                                          | Status      |
|-----------------------------------------------|-------------|
| Fetch cards from MongoDB Atlas via API        | ✅ Done     |
| Render swipeable cards                        | ✅ Done     |
| Implement swipe gestures (left/right)         | ✅ Done     |
| Ensure text resizes to fit cards              | ✅ Done     |
| Display "Thank you" card when stack is empty  | ✅ Done     |
| Deploy functional swipe UI to Vercel          | ✅ Done     |

---

## ✅ Phase 4 – System Integration & Polishing

| Task                                              | Status  | Timestamp |
|---------------------------------------------------|---------|-----------|
| Text layout edge-case testing                     | ✅ Done | 2025-03-10T09:32:14.521Z |
| Final test in mobile and desktop environments     | ✅ Done | 2025-03-15T14:18:43.109Z |
| Final Vercel production deployment                | ✅ Done | 2025-03-20T10:45:32.783Z |

---

## ✅ Phase 5 – Performance & Reliability Improvements

| Task                                              | Status  | Timestamp |
|---------------------------------------------------|---------|-----------|
| Replace Socket.io with HTTP polling               | ✅ Done | 2025-05-23T14:55:21.342Z |
| Enhance card information display                  | ✅ Done | 2025-05-23T15:10:47.829Z |
| Add personal ranking view                         | ✅ Done | 2025-05-23T15:18:32.456Z |
| Fix date formatting to ISO 8601 standard          | ✅ Done | 2025-05-23T15:25:19.683Z |
| Implement edit functionality in admin panel       | ✅ Done | 2025-05-23T15:30:45.912Z |

---

## 🔄 Phase 6 – Enhanced User Experience & UI Improvements

| Task                                              | Status  | Planned Timestamp |
|---------------------------------------------------|---------|-------------------|
| Change default view to "Cards you have voted on"  | 🔄 In Progress | 2025-05-24T10:00:00.000Z |
| Fix KPI display in personal rankings view         | 🔄 In Progress | 2025-05-24T12:00:00.000Z |
| Align edit/delete buttons in admin card editor    | 📅 Todo | 2025-05-24T14:00:00.000Z |
| Move Rankings to top menu between Vote and Admin  | 📅 Todo | 2025-05-24T16:00:00.000Z |
| Add vote indicators (green/red/grey) to cards     | 📅 Todo | 2025-05-25T10:00:00.000Z |
| Add like/dislike counts to global ranking view    | 📅 Todo | 2025-05-25T12:00:00.000Z |

---

## 🔮 Phase 7 – User Preferences & Advanced Statistics

| Task                                              | Status  | Planned Timestamp |
|---------------------------------------------------|---------|-------------------|
| Create user preference tracking model             | 📅 Future | 2025-06-01T10:00:00.000Z |
| Build API endpoint for storing swipe decisions    | 📅 Future | 2025-06-03T10:00:00.000Z |
| Implement basic analytics dashboard               | 📅 Future | 2025-06-05T10:00:00.000Z |
| Add export functionality for collected data       | 📅 Future | 2025-06-07T10:00:00.000Z |
| Add simple data visualization                     | 📅 Future | 2025-06-09T10:00:00.000Z |

---

## 🔮 Phase 8 – Enhanced Interaction Modes

| Task                                                      | Status  | Planned Timestamp |
|-----------------------------------------------------------|---------|-------------------|
| Implement card categories for content organization        | 📅 Future | 2025-06-15T10:00:00.000Z |
| Add support for image content in cards                    | 📅 Future | 2025-06-20T10:00:00.000Z |
| Create multi-step card flows (card sequences)             | 📅 Future | 2025-06-25T10:00:00.000Z |
| Add rating scale options beyond binary like/dislike       | 📅 Future | 2025-06-30T10:00:00.000Z |
| Implement card search and filtering in admin panel        | 📅 Future | 2025-07-05T10:00:00.000Z |

---

## 🔮 Phase 9 – User Authentication & Profiles

| Task                                                       | Status  | Planned Timestamp |
|------------------------------------------------------------|---------|-------------------|
| Implement user authentication (email/social login)         | 📅 Future | 2025-07-10T10:00:00.000Z |
| Create user profile storage model                          | 📅 Future | 2025-07-15T10:00:00.000Z |
| Add user preference settings page                          | 📅 Future | 2025-07-20T10:00:00.000Z |
| Create permission system (admin/user/moderator)            | 📅 Future | 2025-07-25T10:00:00.000Z |
| Add user session tracking and resumption                   | 📅 Future | 2025-07-30T10:00:00.000Z |

---

## 🔮 Phase 10 – Advanced Analytics & Insights

| Task                                                      | Status  | Planned Timestamp |
|-----------------------------------------------------------|---------|-------------------|
| Build comprehensive analytics dashboard                   | 📅 Future | 2025-08-05T10:00:00.000Z |
| Implement A/B testing for card content                    | 📅 Future | 2025-08-10T10:00:00.000Z |
| Add heat mapping for user engagement tracking             | 📅 Future | 2025-08-15T10:00:00.000Z |
| Create report generation and export tools                 | 📅 Future | 2025-08-20T10:00:00.000Z |
| Implement machine learning for content recommendations    | 📅 Future | 2025-08-25T10:00:00.000Z |

---

## 📘 Notes

- Each phase is delivered independently and verified via deployment.
- Card data is manually tested.
- Deployment is strictly tied to GitHub commits.
- Admin and User sides are developed in parallel only after backend is stable.
- All timestamps follow ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ
- Task status key:
  - ✅ Done: Task has been completed and deployed
  - 🔄 In Progress: Task is currently being worked on
  - 📅 Todo: Task is planned but not yet started
  - 📅 Future: Task is scheduled for future development

## 📋 Current Sprint Details - Phase 6

1. **Change default view to "Cards you have voted on"**
   - Update rankings.js to set initial view to personal rankings
   - Modify state initialization to default to 'personal' instead of 'global'
   - Target completion: 2025-05-24T10:00:00.000Z

2. **Fix KPI display in personal rankings view**
   - Debug calculation of "Your Ranked Cards", "Top Card Win Rate", "Total Votes Cast"
   - Ensure personal stats reflect user's voting history accurately
   - Target completion: 2025-05-24T12:00:00.000Z

3. **Align edit/delete buttons in admin card editor**
   - Redesign button layout to maintain position during edit mode
   - Ensure input field doesn't cause layout distortion
   - Target completion: 2025-05-24T14:00:00.000Z

4. **Move Rankings to top menu between Vote and Admin**
   - Update navigation component to reposition Rankings menu item
   - Ensure mobile navigation reflects the same ordering
   - Target completion: 2025-05-24T16:00:00.000Z

5. **Add vote indicators to cards**
   - Add colored indicators (green/red/grey) to show user vote status
   - Fetch and display user's previous votes on cards
   - Target completion: 2025-05-25T10:00:00.000Z

6. **Add like/dislike counts to global ranking view**
   - Modify API to return like/dislike counts for each card
   - Update UI to display total likes and dislikes in global view
   - Target completion: 2025-05-25T12:00:00.000Z
