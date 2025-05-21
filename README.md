# DONEISBETTER — Swipe-based Decision Prototype

## 📌 Project Overview

**doneisbetter** is a swipe-based Progressive Web App (PWA) prototype built for rapid feedback collection through card-based interactions. Users can swipe **right (like)** or **left (dislike)** on individual cards that are loaded from MongoDB Atlas. Once the card stack is exhausted, the app displays a final "Thank you" card to indicate completion.

## 🧠 Concept Summary

- **Purpose**: Collect swipe-based user input on textual cards.
- **Mechanism**: Users interact via swipe gestures; input is not stored in this prototype.
- **Target Output**: Fully functional, mobile-first prototype deployed to Vercel.

## 🎯 Core Requirements

| Area         | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| Admin Panel  | Add/delete text cards stored in MongoDB Atlas                               |
| User UI      | Swipe left/right on full-screen cards with responsive text resizing         |
| No More Cards| Show “Thank you” message when cards are exhausted                           |
| Deployment   | Vercel-hosted app with GitHub-based CI/CD                                   |

## 🔧 Technology Stack (fixed)
- **Frontend**: Next.js
- **Backend**: Next.js API Routes + Mongoose
- **Database**: MongoDB Atlas
- **Realtime**: Socket.io
- **Hosting**: Vercel
- **Version Control**: GitHub

## 📂 Folder Structure

```
/doneisbetter
├── frontend (Next.js PWA)
├── backend  (API, MongoDB, Socket.io)
├── docs     (all markdown documentation)
```

## 🔒 Security & Auth
No authentication in the prototype phase. Admin panel is accessible via direct route.

## ✅ Rules Applied
- “**Done is Better Than Perfect**” principle
- Strictly follows AI usage, documentation, and deployment rules
- All files written in full — no placeholders, no omissions

## 👤 Maintainer
Moldován Csaba — Product Owner & Developer

