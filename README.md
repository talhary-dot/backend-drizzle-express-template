# Backend Template

This is a production-ready Node.js/TypeScript backend template using Express, Drizzle ORM, and PostgreSQL. It features a robust build system using `tsx` for development and `tsup` for optimized, standalone production builds.

## Features

- **Runtime**: Node.js (v22+ recommended)
- **Language**: TypeScript (ESNext)
- **Framework**: Express
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: `tsx` for fast, zero-config execution
- **Production**: `tsup` for standalone, minified, zero-dependency bundles
- **Docker**: Minimal Alpine-based image (~50MB)

## Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=3000
# Add other variables as needed
```

### 3. Development

Run the development server with hot-reloading:

```bash
npm run dev
```

Run database migrations:

```bash
npm run drizzle:migrate
```

## Production Build

This template uses `tsup` to bundle the entire application (including `node_modules`) into a single file. This means you do **not** need to run `npm install` on your production server.

### Build

```bash
npm run build
```

This generates a `dist/server.cjs` file (~1MB).

### Run (Standalone)

Copy `dist/` and `.env` to your server and run:

```bash
node dist/server.cjs
```

(npm is not required)

## Docker

Build a minimal production container:

```bash
# Build
docker build -t backend-app .

# Run
docker run -p 3000:3000 --env-file .env backend-app
```

## Project Structure

- `src/`: Source code
- `libs/`: Shared libraries and DB config
- `drizzle/`: Database migrations
- `dist/`: Production artifacts (generated)
- `tsup.config.ts`: Build configuration
