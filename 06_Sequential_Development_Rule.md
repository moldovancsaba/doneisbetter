# 06_SEQUENTIAL_DEVELOPMENT_RULE.md — DONEISBETTER [2025-05-24T02:52:45.789Z]

## 🔁 Core Principle: One Step at a Time

The doneisbetter project must be developed using **strict step-by-step sequencing**. No future task may begin before the current one is:

- Fully implemented
- Verified and tested
- Documented and committed
- Deployed to Vercel Production

---

## 🚦 Sequential Development Protocol

| Step | Rule Description                                                                 |
|------|----------------------------------------------------------------------------------|
| 1    | Define the task and its expected outcome                                         |
| 2    | Implement only that single task                                                  |
| 3    | Test the result in isolation                                                     |
| 4    | Verify cross-component consistency (especially navigation)                       |
| 5    | Commit to GitHub with proper message and versioning (if applicable)              |
| 6    | Deploy to Vercel Production                                                      |
| 7    | Update documentation with ISO 8601 timestamps and mark the task DONE             |
| 8    | Update system documentation (24_system_documentation.md) if necessary            |
| 9    | Only then proceed to the next task                                               |

---

## 🧱 No Parallel Work

- ❌ No multitasking across multiple features
- ❌ No jumping ahead to future steps
- ❌ No inconsistent implementations across components
- ✅ Focus on simplicity and completion
- ✅ Ensure cross-component consistency

---

## ✅ Examples

| ✅ Allowed                          | ❌ Not Allowed                           |
|------------------------------------|------------------------------------------|
| Build and test one API route       | Build two routes at once                 |
| Create one UI component fully      | Scaffold UI before backend is connected  |
| Add deploy-ready logic             | Leave logic half-finished                |
| Update navigation consistently     | Update only one navigation component     |
| Document with ISO 8601 timestamps  | Use inconsistent timestamp formats       |

---

## 📌 Rule Enforcement

This protocol is not optional. Every commit and deployment must reflect one completed task. It is the foundation of the "done is better than perfect" execution model.

## 🔄 Lessons Learned

Recent development has reinforced these key principles:

1. **Navigation Consistency**: All navigation components must be updated simultaneously to maintain a consistent user experience
2. **Documentation Timeliness**: Documentation must be updated immediately after implementation with correct timestamps
3. **Cross-Component Testing**: Changes to shared UI elements must be verified across all contexts

## 📝 Version History

- Initial documentation: 2025-05-10
- Updated with navigation consistency requirements: 2025-05-24T02:52:45.789Z
