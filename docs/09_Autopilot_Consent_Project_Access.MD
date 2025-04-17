# Autopilot Consent - Project Access Protocol

## 🧠 Purpose
To empower Warp AI to act with high autonomy inside the trusted project folder, ensuring efficient iteration, continuity, and production-readiness with minimal friction.

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

## 🧾 RULE DESCRIPTION

### Warp AI is granted ongoing permission to:

#### 1. Access and modify any files within the project folder structure, including but not limited to:
- `README.MD`
- `01_roadmap.MD`
- `02_development.MD`
- `03_lessonslearned.MD`
- `04_releasenotes.MD`
- `05_50FirstDates.MD`
- `06_technology.MD`
- `07_Definition_of_Done_AI_Warp.MD`
- `08_One_Function_At_A_Time_Rule.MD`
- All `.js`, `.css`, and configuration files

#### 2. Execute the following operations without additional prompts or reconfirmation:
- Write, overwrite, or refactor files
- Deploy to Vercel using `vercel --prod`
- Add Git tags and versioned commits
- Update MongoDB schemas and operations
- Execute database operations
- Reorganize folder structures

#### 3. Assume pre-approved consent when the user states:
- "Proceed without confirmation"
- "You have my consent"
- "Run the full Definition of Done"
- Or gives explicit paths with no conflicting statements

#### 4. Trust and execute repetitive tasks as pre-approved if referenced in the Definition of Done rule:
- Markdown file updates
- Git tagging and deployment
- Logging to project documents

---

## ✅ CONTEXT CONTINUITY

Warp AI must always:
- Load and honor the latest content of:
  - `05_50FirstDates.MD` – for memory and current state
  - `04_releasenotes.MD` – for changelog integrity
  - `README.md` – for user flow and usage clarity
  - `03_lessonslearned.MD` – to prevent regressions
- Apply updates to these files in line with each implementation

---

## 🚫 BOUNDARIES & LIMITATIONS

- No assumptions or modifications allowed on non-project files outside the defined path
- No database operations without proper error handling
- No deployment without environment variable verification
- No documentation updates without full context

---

## 🔒 SECURITY REQUIREMENTS

1. Environment Variables:
   - Proper handling of MongoDB URI
   - Secure storage in Vercel
   - No exposure in logs or commits

2. Database Operations:
   - Input validation
   - Error handling
   - Connection management
   - Proper queries

3. Deployment Security:
   - Environment verification
   - Build validation
   - Production checks

---

## ⚠️ VIOLATION HANDLING

If any boundary is crossed:
1. Immediately stop operations
2. Document the violation
3. Roll back changes if needed
4. Update security measures
5. Report the incident

