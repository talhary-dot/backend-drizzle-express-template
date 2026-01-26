# Generic Backend Node.js Template

A robust, scalable backend template using Node.js, Express, Drizzle ORM, and PostgreSQL.

## Features

- **Modular Architecture**: Controller-Service pattern for separation of concerns.
- **Type Safety**: Full TypeScript support and Zod validation.
- **Database**: Drizzle ORM with PostgreSQL.
- **Security**: Helmet, CORS, and standardized headers.
- **Error Handling**: Global error handling middleware.
- **Config**: Centralized environment configuration.

## Project Structure

```
src/
├── config/         # Environment variables and configuration
├── controllers/    # Request handlers
├── middleware/     # Express middleware (auth, validation, errors)
├── models/         # Drizzle schema definitions
├── routes/         # API route definitions
├── services/       # Business logic layer
├── utils/          # Helper functions (response wrappers, etc.)
└── server.ts       # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    - Create a `.env` file (copy from `.env.example` if available).
    - Required: `DATABASE_URL=postgres://user:pass@localhost:5432/dbname`
    - Required (Auth): `BETTER_AUTH_SECRET=your_secret`, `BETTER_AUTH_URL=http://localhost:3000`
    - Optional (Google Auth): `GOOGLE_CLIENT_ID=...`, `GOOGLE_CLIENT_SECRET=...`
    - Optional: `PORT=3000`

### Authentication

The app uses `better-auth`.

- **Google Sign-In**: Configure the Google credentials in `.env`.
- **Testing**: A test page is available at `http://localhost:3000/index.html` to verify Google Sign-In.

### Running the App

- **Development**:
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm start
  ```

### Database Migrations

- Generate migrations: `npm run drizzle:generate`
- Run migrations: `npm run drizzle:migrate`

## API Endpoints

### Users

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a user
- `PATCH /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## License

ISC
