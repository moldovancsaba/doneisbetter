# Done Is Better ✍️

A minimalist text card application with MongoDB integration.

**Status**: 🟢 Foundation Complete  
**Version**: v0.1.0  
**Live**: [doneisbetter-6o3vm7ng0-narimato.vercel.app](https://doneisbetter-6o3vm7ng0-narimato.vercel.app)

## Quick Start

```bash
git clone https://github.com/moldovancsaba/doneisbetter.git
cd doneisbetter
npm install
npm run dev
```

## Project Structure

- `app/` - Next.js application core
  - `layout.js` - Root layout with theme configuration
  - `page.js` - Main application entry point
- `docs/` - Project documentation
  - [01_roadmap.MD](docs/01_roadmap.MD) - Project roadmap
  - [02_development.MD](docs/02_development.MD) - Development details
  - [03_lessonslearned.MD](docs/03_lessonslearned.MD) - Implementation insights
  - [04_releasenotes.MD](docs/04_releasenotes.MD) - Version history
  - [05_50FirstDates.MD](docs/05_50FirstDates.MD) - Development diary
  - [06_technology.MD](docs/06_technology.MD) - Tech stack details

## Tech Stack

- Next.js 15.3.0
- React 19
- MongoDB
- CSS Modules
- Vercel Deployment
- Git Version Control

## Documentation

### Project Documentation
- [Development Timeline](docs/05_50FirstDates.MD)
- [Release History](docs/04_releasenotes.MD)
- [Implementation Insights](docs/03_lessonslearned.MD)
- [Project Roadmap](docs/01_roadmap.MD)
- [Technical Details](docs/06_technology.MD)

### AI Development Guidelines
- [Definition of Done](docs/07_Definition_of_Done_AI_Warp.MD)
- [One Function Rule](docs/08_One_Function_At_A_Time_Rule.MD)
- [Autopilot Consent](docs/09_Autopilot_Consent_Project_Access.MD)
- [AI Knowledge Rules](docs/10_AI_Knowledge_Rules.MD)
- [AI Truthfulness](docs/11_AI_Truthfulness_and_Verification.MD)
## Features

- Single line input field with focus states
- Click or Escape to cancel input
- Enter to submit new cards
- MongoDB storage
- Newest to oldest display order

## Known Limitations

- Requires MongoDB connection
- Basic styling (no Tailwind)
- Simple input/display functionality
