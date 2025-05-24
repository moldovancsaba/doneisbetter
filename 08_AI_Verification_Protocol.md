# 08_AI_VERIFICATION_PROTOCOL.md — DONEISBETTER [2025-05-24T02:52:45.789Z]

## 🧪 AI Content Verification Protocol

All AI-generated output must follow a **strict verification process** before it can be accepted into the *doneisbetter* project. No exceptions.

---

## ✅ Verification Checklist

| Area             | Required Validation                                           |
|------------------|---------------------------------------------------------------|
| Format           | Complete, well-structured, no placeholders                    |
| Content          | Aligned with project scope, stack, and naming conventions     |
| Functionality    | Code must be testable, modular, and match described purpose   |
| File Readiness   | Must be ready-to-use `.md` or `.js` file — no gaps or stubs   |
| Deployment Claim | Only state deploy status if it was **verifiably triggered**   |
| Clarity          | Clear, Easy English — no ambiguous or technical overreach     |
| Navigation       | Consistent across all components (Header, MobileNav, Navigation) |
| Documentation    | Timestamps in ISO 8601 format with milliseconds (YYYY-MM-DDThh:mm:ss.SSSZ) |

---

## 🚨 Critical Violations (Must NEVER Occur)

| Violation                          | Consequence                           |
|------------------------------------|----------------------------------------|
| Generating incomplete `.md` files  | Document invalid; must be regenerated  |
| Referencing unstaged deployments   | Marked as misleading, must be removed  |
| Stating "this document provides…"  | Entire response disqualified           |
| Claiming commit/deploy without proof | Considered hallucination              |
| Inconsistent navigation implementations | Must be fixed across all components   |
| Incorrect timestamp formatting      | Must be updated to ISO 8601 standard    |

---

## 🔍 AI Verification Flow

1. **Step 1 — Self-validation**  
   AI checks structure, formatting, and logic against documentation rules.

2. **Step 2 — User confirmation**  
   File must be downloaded or viewed by the user.

3. **Step 3 — Confirmation by Output**  
   Final version must reflect verified deployment or ready-for-use output.

4. **Step 4 — Navigation Consistency Check**  
   Verify all navigation components (Header.js, MobileNav.js, Navigation.js) have:
   - Identical menu items with the same ordering
   - Consistent use of emojis for each menu item
   - Proper routing to the correct pages
   - Consistent styling and visual appearance

5. **Step 5 — Documentation Standards Check**  
   Verify all updated documentation files have:
   - ISO 8601 timestamp with milliseconds (YYYY-MM-DDThh:mm:ss.SSSZ)
   - Updated version history section
   - Proper cross-references to related documents
   - Accurate and complete information about the changes

---

## 📌 Enforcement

This protocol is binding. Any AI-generated output that bypasses these rules must be deleted and recreated according to this verification process. The protocol itself is versioned and applied retroactively if needed.

## 🧩 Navigation Verification Specifics

When changes are made to navigation components, verify:

1. **Menu Item Consistency**
   - Header.js: Home 🏠, Rankings 🏆, Swipe 🔄, Vote 🗳️, Admin ⚙️
   - MobileNav.js: Same items with identical emojis
   - Navigation.js: Same items with identical emojis

2. **Functionality Verification**
   - Each menu item properly routes to the correct page
   - Active item is highlighted correctly
   - Mobile responsiveness works as expected
   - Dark/light mode toggle functions properly

## 📝 Documentation Verification Specifics

When updating documentation, verify:

1. **Timestamp Format**
   - Header format: `[YYYY-MM-DDThh:mm:ss.SSSZ]`
   - Version history entries: `YYYY-MM-DDThh:mm:ss.SSSZ`
   - All dates referenced in content use the same format

2. **Content Completeness**
   - All relevant changes are documented
   - System documentation (24_system_documentation.md) is updated if applicable
   - Documentation index reflects all current files

## 📝 Version History

- Initial documentation: 2025-05-10
- Updated with navigation and documentation verification: 2025-05-24T02:52:45.789Z
