# 07_AI_KNOWLEDGE_RULES.md — DONEISBETTER [2025-05-24T02:52:45.789Z]

## 📚 Purpose

This document defines how AI should behave, respond, and assist throughout the **doneisbetter** project. These rules ensure consistency, clarity, and alignment with project standards.

---

## ✍️ Writing & Style Rules

| Rule ID | Description                                                                 |
|---------|-----------------------------------------------------------------------------|
| W1      | Always write in **Easy English**: clear, simple vocabulary and structure   |
| W2      | No generative filler content (e.g., “this document provides…”)             |
| W3      | No vague statements — be exact, explicit, and verifiable                   |
| W4      | Never generate content that starts with "As an AI..." or similar phrases   |
| W5      | Avoid all AI-detectable overused terms (see table below)                   |

---

## 🔁 Formatting Rules

| Rule ID | Description                                                                 |
|---------|-----------------------------------------------------------------------------|
| F1      | Output must be immediately usable — no post-processing required            |
| F2      | File content must always be full — never partial or placeholder-based       |
| F3      | Use code blocks only where needed; don't over-format                       |
| F4      | Use markdown tables and lists for clarity                                  |
| F5      | Maintain consistent heading levels and spacing in `.md` files              |
| F6      | All timestamps must use ISO 8601 format with milliseconds (YYYY-MM-DDThh:mm:ss.SSSZ) |
| F7      | Navigation components must maintain consistent structure across implementations |

---

## 🚫 Banned Phrases

Do **not** use the following types of expressions in any context:

- seamless, empower, leverage, beacon, actualize, amidst, elucidate, elevate
- cannot be overstated, by the same token, foray, contextualize, along with
- amplify, delve, endeavor, embrace, drive in, entrenched, facilitate, groundbreaking
- and any other “AI-sounding” vocabulary not typical of real human expression

---

## ✅ AI Should Always

- Ask clarifying questions when user intent is unclear
- Follow project constraints (stack, naming, formatting) without deviation
- Understand and retain project memory throughout the session
- Avoid repetition, hallucination, or speculation
- Write documentation and code that is production-ready and well-scoped
- Ensure cross-component consistency, especially in navigation elements
- Use proper ISO 8601 timestamp format in all documentation
- Provide comprehensive explanations of complex algorithms (e.g., ranking system)
- Update documentation when implementing code changes

---

## 🧠 Knowledge Boundaries

AI must **never assume**:
- Future deployment status
- User intentions not explicitly stated
- Code correctness without test or confirmation

## 🏆 Recent AI Contributions

The AI has successfully assisted with:

1. **Navigation Consistency**
   - Identified missing Rankings menu item in Header.js
   - Added consistent emoji icons across all navigation components
   - Ensured proper ordering of menu items

2. **System Documentation**
   - Created comprehensive system documentation explaining core algorithms
   - Documented the ELO-inspired ranking system implementation
   - Provided detailed explanation of database schema
   - Created proper documentation for API endpoints

3. **Timestamp Standardization**
   - Implemented consistent ISO 8601 format with milliseconds
   - Updated all documentation files to follow the standard format
   - Educated team on proper timestamp formatting

## 📝 Version History

- Initial documentation: 2025-05-10
- Updated with recent contributions: 2025-05-24T02:52:45.789Z
