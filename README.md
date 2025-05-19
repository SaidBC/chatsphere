# ChatSphere UI

This is the enhanced UI component for the ChatSphere real-time chat application. Built with Next.js, it provides a modern, responsive user interface with additional features beyond the core frontend.

## Technologies

- **Next.js**: React framework with server-side rendering
- **TypeScript**: For type safety
- **TailwindCSS**: Utility-first CSS framework
- **Geist UI**: Modern UI components
- **API Integration**: Connects to ChatSphere API
- **PostgreSQL**: Relational database for data persistence
- **Prisma**: Type-safe ORM for database access

## Project Structure

```
chatsphere/
├── app/                # Next.js app directory
│   ├── api/            # API routes
│   ├── components/     # UI components
│   └── page.tsx        # Main page component
├── public/             # Static assets
├── styles/             # CSS styles
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
├── next.config.js      # Next.js configuration
└── package.json        # Dependencies and scripts
```

## Features

- **Enhanced UI**: Modern, responsive design
- **Token Management**: UI for generating and managing API tokens
- **User Management**: User profile and settings
- **Room Management**: Create, join, and manage chat rooms
- **Real-time Notifications**: Notifications for new messages

## Setup and Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_WS_URL=ws://localhost:3001
   DATABASE_URL=postgresql://username:password@localhost:5432/chatsphere
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```
   This will create the database tables based on the Prisma schema.

4. Start the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## Database Structure

ChatSphere uses PostgreSQL with Prisma ORM for data management. The database includes the following models:

- **User**: User accounts and profile information
- **Account**: OAuth provider accounts linked to users
- **Session**: User sessions for authentication
- **VerificationToken**: Email verification tokens
- **ApiToken**: API access tokens for users and clients

Note: Chat rooms and messages are handled by the backend API service.

## Integration with ChatSphere API

The ChatSphere UI integrates with the ChatSphere API server for:

1. **User Authentication**: Login and registration
2. **Token Management**: Generate and manage API tokens
3. **Room Management**: Create and join chat rooms
4. **Message Handling**: Send and receive messages

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create an optimized production build.

## Deployment

The easiest way to deploy the ChatSphere UI is to use the [Vercel Platform](https://vercel.com) from the creators of Next.js.

```bash
npm run build
npm start
```

## License

MIT
