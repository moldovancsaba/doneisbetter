# Release Notes

## v0.2.0 - Core Functionality (2025-04-13)

### Features
- Implemented input field for adding new cards.
- Added functionality to save cards to MongoDB via server actions.
- Display saved cards below the input, sorted newest first.
- Included basic styling and dark mode support via CSS.
- Added error handling for database operations and form submission.

### Technical Details
- Created `lib/db.js` for reusable MongoDB connection.
- Implemented `createCard` and `getCards` server actions in `app/actions.js`.
- Developed client-side `components/Input.js` with state management.
- Updated `app/page.js` to integrate components and fetch/display data.

## v0.1.0 - Initial Release (2025-04-12)

### Features
- Single line input field implementation
- MongoDB integration
- Basic card display
- Production deployment

### Technical Details
- Next.js 15.3.0 setup
- MongoDB connection with Mongoose
- CSS Modules for styling
- Vercel deployment configuration

### Known Issues
- Basic styling implementation
- Limited error handling
- No data pagination

### Dependencies
- next: 15.3.0
- react: 19
- react-dom: 19
- mongodb: latest
- mongoose: latest

### Environment Variables
- MONGODB_URI: MongoDB connection string

### Deployment
- Platform: Vercel
- URL: https://doneisbetter-n77pwfkpk-narimato.vercel.app

