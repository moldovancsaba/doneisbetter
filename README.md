# DoneisBetter

DoneisBetter is a modern, real-time decision-making application built with Next.js, Socket.io, and MongoDB. It implements a Tinder-like swipe interface to help users make quick decisions.

## Features

- 🔄 Real-time card synchronization
- 👆 Intuitive swipe interface
- 🌙 Dark mode support
- 📱 Fully responsive design
- ⚡ Modern UI with smooth animations
- 🔒 Admin panel for card management

## Tech Stack

- **Frontend**: Next.js, Framer Motion, TailwindCSS
- **Backend**: Socket.io, MongoDB
- **Deployment**: Vercel
- **State Management**: React Hooks + Context
- **Styling**: TailwindCSS + CSS-in-JS

## Getting Started

### Prerequisites

- Node.js 16.x or later
- MongoDB instance
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/doneisbetter.git
cd doneisbetter
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_uri
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
doneisbetter/
├── components/          # Reusable UI components
│   ├── features/       # Feature-specific components
│   ├── layout/         # Layout components
│   └── ui/            # Base UI components
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── _app.js        # App wrapper
│   ├── index.js       # Home page
│   ├── swipe.js       # Swipe interface
│   └── admin.js       # Admin panel
├── styles/            # Global styles and theme
├── hooks/             # Custom React hooks
└── public/            # Static assets
```

## Key Components

### CardStack
The main swipe interface component that handles card interactions and animations.

### Socket.io Integration
Real-time communication between clients and server for synchronized card updates.

### Theme System
Comprehensive theming system with dark mode support and consistent design tokens.

## Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Best Practices

- Follow the existing component structure
- Use the provided theme tokens for consistency
- Implement proper error handling
- Add JSDoc comments for complex functions
- Follow the commit message convention

## Deployment

The application is automatically deployed to Vercel on push to the main branch.

Manual deployment:
```bash
vercel
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for the hosting platform
- All contributors and users of the project

## Support

For support, email support@doneisbetter.com or open an issue in the repository.
