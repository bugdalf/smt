# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Expo application called "simple-money-tracker" that uses:
- **Expo Router** for file-based routing
- **Drizzle ORM** with SQLite for database management
- **TypeScript** for type safety
- **React Native** for cross-platform mobile development

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Platform-specific development
npm run android    # Android emulator
npm run ios        # iOS simulator  
npm run web        # Web browser

# Code quality
npm run lint       # ESLint checking
```

## Database Management

The project uses Drizzle ORM with SQLite:

- **Schema**: `db/schema.ts` - Contains table definitions (tasks, lists)
- **Migrations**: `drizzle/` directory - Auto-generated migration files
- **Config**: `drizzle.config.ts` - Drizzle configuration for SQLite with Expo driver

Database is initialized in `app/_layout.tsx` with automatic migrations on app start.

## Project Structure

```
app/                 # Expo Router pages (file-based routing)
  _layout.tsx        # Root layout with SQLite provider and navigation
  index.tsx          # Home screen
db/
  schema.ts          # Database schema definitions
drizzle/             # Generated migrations and metadata
assets/              # Static assets (images, fonts)
app-example/         # Original Expo template (reference)
```

## Key Architecture Notes

- **Database**: SQLite with Drizzle ORM, migrations run automatically on app start
- **Routing**: File-based routing with Expo Router stack navigation
- **State Management**: React hooks with SQLite provider context
- **Database Name**: "example" (defined in `app/_layout.tsx:8`)
- **Path Aliases**: `@/*` resolves to project root (configured in `tsconfig.json`)

## Database Schema

Current tables:
- `tasks`: id, name, list_id (foreign key to lists)
- `lists`: id, name

Export type `Task` available from `db/schema.ts` for TypeScript usage.