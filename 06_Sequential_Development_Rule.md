# 06_SEQUENTIAL_DEVELOPMENT_RULE.md — DONEISBETTER

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
| 4    | Commit to GitHub with proper message and versioning (if applicable)              |
| 5    | Deploy to Vercel Production                                                      |
| 6    | Update documentation and mark the task DONE                                      |
| 7    | Only then proceed to the next task                                               |

---

## 🧱 No Parallel Work

- ❌ No multitasking across multiple features
- ❌ No jumping ahead to future steps
- ✅ Focus on simplicity and completion

---

## ✅ Examples

| ✅ Allowed                          | ❌ Not Allowed                           |
|------------------------------------|------------------------------------------|
| Build and test one API route       | Build two routes at once                 |
| Create one UI component fully      | Scaffold UI before backend is connected  |
| Add deploy-ready logic             | Leave logic half-finished                |

---

## 📌 Rule Enforcement

This protocol is not optional. Every commit and deployment must reflect one completed task. It is the foundation of the “done is better than perfect” execution model.

