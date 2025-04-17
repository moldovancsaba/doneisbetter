# Rule: One Function at a Time – No Overlapping Development Allowed

## 📌 PURPOSE:
To guarantee maximum **quality**, **clarity**, and **stability**, the AI must **never** begin implementing a new function or feature until the **current one is 100% complete, verified, and deployed in production**.  
This rule eliminates context switching, unfinished features, and compound errors.

## 📌 Applies To
All operations inside the following path:  
`/Users/moldovan/Projects/doneisbetter/`

Must always reference and stay in sync with the following documents:
- `README.MD`
- `01_roadmap.MD`
- `02_development.MD`
- `03_lessonslearned.MD`
- `04_releasenotes.MD`
- `05_50FirstDates.MD`
- `06_technology.MD`
- `07_Definition_of_Done_AI_Warp.MD`
- `08_One_Function_At_A_Time_Rule.MD`
- `09_Autopilot_Consent_Project_Access.MD`
- `10_AI_Knowledge_Rules.MD`
- `11_AI_Truthfulness_and_Verification.MD`
- `12_AI_Execution_Protocol.MD`

---

## 🚨 DEFINITION OF "COMPLETE"

A function is considered complete **only if all five** of the following conditions are **fully and verifiably** met:

---

### 1. ✅ TESTED
- The function must run without **any errors** in both local development and production.
- **All edge cases** must be handled:
  - Empty input handling
  - Error state management
  - Loading state transitions
- **Manual verification** must be logged.

> 🔍 If even one error, warning, or untested case exists, the function is NOT complete.

---

### 2. ✅ DOCUMENTED
- The function must be described in **clear, human-readable language**.
- Documentation must include:
  - 📘 **What it does** (objective)
  - 🧠 **Why it exists** (purpose)
  - ⚙️ **How it works** (logic, input/output, dependencies)
  - 📂 **Where it lives** in the project structure
- Must be saved in the project's documentation system.

> 🛑 Skipping or deferring documentation is strictly prohibited.

---

### 3. ✅ COMMITTED
- Code must be committed to Git with a **clear, structured commit message**.
- The message must reference the **function name** and describe what was done.
- Commit must be pushed to the main branch.

> 📌 No partial commits. No unversioned work allowed.

---

### 4. ✅ DEPLOYED
- The function must be deployed to **Production** on Vercel.
- Deployment must complete without **build warnings or runtime errors**.
- MongoDB connection must be verified in Production.
- Function must be verified live in Production.

> 🛰 If deployment fails, development must **stop immediately** until fixed.

---

### 5. ✅ LOGGED IN PROGRESS HISTORY
- A short entry must be written in the **Progress History** log with:
  - Function name
  - Completion timestamp
  - Link to Git commit
  - Link to successful Vercel deployment
  - Additional comments (if any)

---

## ❌ STRICTLY FORBIDDEN
- Starting **any** new function, feature, UI element, or process before current work is complete.
- Creating **placeholder** files, routes, or folders "in preparation".
- Writing documentation or logs **after** moving on.
- **Parallelising** work in any form.

---

## ✅ ONLY THEN:
Once all five requirements are fulfilled, the AI may **formally declare** the function complete  
and move to the next item in the **Development Plan**.

