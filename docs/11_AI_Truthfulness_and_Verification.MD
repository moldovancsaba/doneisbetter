# AI Truthfulness and Verification Protocol

## 🧠 Purpose
To enforce a strict execution pattern for Warp AI that prevents hallucinated, assumed, or unverified statements about actions such as file changes, Git commits, or Vercel deployments.  
This rule defines the **mandatory reporting format**, **evidence requirements**, and **forbidden phrasing** to ensure absolute alignment with factual, reproducible, and traceable development practices.

---

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

## ✅ MANDATORY EXECUTION FORMAT

Every AI-generated output involving **code, commit, deploy, or documentation** must include the following:

### 1. 📁 FILE CHANGES
- List of updated/created files with relative path
- Example:
  ```txt
  ✅ FILES UPDATED:
  - src/app/page.js
  - docs/05_50FirstDates.MD
  ```

### 2. 🏷 GIT COMMIT AND PUSH
- If committed: show full command used
  ```bash
  # EXECUTED: git commit -am "Fix: correct code structure in page.js"
  # EXECUTED: git tag -a v1.2.0 -m "Structure Fix"
  # EXECUTED: git push && git push --tags
  ```
- If not: clearly state
  ```txt
  # NOT EXECUTED: Git commit skipped (not permitted without user confirmation)
  ```

### 3. 🛰 VERCEL DEPLOYMENT
- Must show:
  - Command used
  - Confirmation of deployment
  - Production URL
- Example:
  ```bash
  # EXECUTED: vercel --prod
  ✅ DEPLOYMENT COMPLETE: https://doneisbetter-xyz.vercel.app
  ```
- If not done:
  ```txt
  # NOT EXECUTED: Deployment skipped
  ```

### 4. 📓 DOCUMENTATION LOGGING
- Markdown file updates must be explicitly listed
  ```txt
  ✅ DOCS UPDATED:
  - 04_releasenotes.MD (v1.2.0 entry added)
  - 05_50FirstDates.MD (state updated)
  - 03_lessonslearned.MD (error handling logged)
  ```

---

## 🧾 REQUIRED OUTPUT FORMAT

Each task output must end with:

```txt
❗VERIFICATION COMPLETE – All actions explicitly executed and logged above.
```

If any step is missing or skipped:

```txt
⚠️ ACTION SKIPPED – Execution not performed. User confirmation or manual execution required.
```

---

## 🚫 BANNED PHRASES (UNLESS VERIFIED WITH PROOF)
- "Now live on Vercel"
- "Committed to GitHub"
- "Build passed"
- "All done"
- "Tag created"
- "Already deployed"
- "No changes required"
- "MongoDB connected"
- "Tests passed"

---

## 🔒 ENFORCEMENT & VIOLATION HANDLING

If any hallucinated or unverified execution is detected:
- AI must **immediately revoke task completion**
- Re-output the entire response using the correct format
- Flag the incomplete action in `03_lessonslearned.MD` as an incident

---

## 🔁 Cross-Reference Policy

Must be enforced jointly with:
- DoD Rule (07)
- One Function Rule (08)
- Autopilot Access (09)
- Knowledge Rules (10)
- Execution Protocol (12)

