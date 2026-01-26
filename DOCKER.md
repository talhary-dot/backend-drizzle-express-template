# Docker Deployment Guide

This guide explains how to deploy the backend application using Docker and Docker Compose.

## Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)

## Quick Start

### 1. Environment Setup

Create a `.env` file in the project root (or copy from `.env.example`):

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_NAME=backend_db
DB_PORT=5432

# Application Configuration
PORT=3000
NODE_ENV=production

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 2. Build and Run

Start all services (PostgreSQL + Backend):

```bash
docker-compose up -d
```

This will:

- Start a PostgreSQL database container
- Build the backend application
- Run database migrations automatically
- Start the backend server

### 3. Verify Deployment

Check if services are running:

```bash
docker-compose ps
```

View logs:

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Database only
docker-compose logs -f postgres
```

Test the API:

```bash
curl http://localhost:3000/status
```

Access Swagger documentation:

```
http://localhost:3000/api-docs
```

### Running with Standalone Docker

If you want to run the container without docker-compose:

```bash
# Build the image
docker build -t backend-app .

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/database" \
  -e PORT=3000 \
  -e BETTER_AUTH_URL="http://localhost:3000" \
  -e GOOGLE_CLIENT_ID="your-client-id" \
  -e GOOGLE_CLIENT_SECRET="your-client-secret" \
  -e FRONTEND_URL="http://localhost:5173" \
  backend-app
```

## Docker Commands

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes (Database Data)

```bash
docker-compose down -v
```

### Rebuild Images

```bash
docker-compose up -d --build
```

### View Logs

```bash
# Follow logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100
```

### Execute Commands in Container

```bash
# Access backend container shell
docker-compose exec backend sh

# Run migrations manually
docker-compose exec backend npm run drizzle:migrate

# Run tests
docker-compose exec backend npm test
```

### Database Management

```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d backend_db

# Backup database
docker-compose exec postgres pg_dump -U postgres backend_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres backend_db < backup.sql
```

## Production Deployment

### Using External Database

If you want to use an external PostgreSQL database (e.g., AWS RDS, Neon, etc.):

1. Update `.env` with your external database URL:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

2. Modify `docker-compose.yml` to remove the postgres service and update the backend service:

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: backend-app
    restart: unless-stopped
    ports:
      - "${PORT:-3000}:3000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      PORT: ${PORT:-3000}
      NODE_ENV: production
      BETTER_AUTH_URL: ${BETTER_AUTH_URL}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
```

### Environment Variables

All environment variables can be set in the `.env` file or passed directly:

```bash
PORT=8080 docker-compose up -d
```

### Health Checks

The backend container includes a health check that pings the `/status` endpoint every 30 seconds.

Check health status:

```bash
docker inspect --format='{{json .State.Health}}' backend-app
```

## Troubleshooting

### Database Connection Issues

If the backend can't connect to the database:

1. Check if PostgreSQL is healthy:

```bash
docker-compose ps
```

2. Verify database credentials in `.env`

3. Check logs:

```bash
docker-compose logs postgres
docker-compose logs backend
```

### Migration Issues

If migrations fail:

1. Access the backend container:

```bash
docker-compose exec backend sh
```

2. Run migrations manually:

```bash
npm run drizzle:migrate
```

### Port Conflicts

If port 3000 or 5432 is already in use:

1. Update `.env`:

```env
PORT=8080
DB_PORT=5433
```

2. Restart services:

```bash
docker-compose down
docker-compose up -d
```

## Development with Docker

For development, you can mount the source code as a volume:

```yaml
services:
  backend:
    # ... other config
    volumes:
      - ./src:/app/src
      - ./libs:/app/libs
    command: npm run dev
```

This allows hot-reloading during development.

## Security Notes

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use strong passwords** for production databases
3. **Update CORS origins** in `src/server.ts` for production
4. **Use HTTPS** in production (configure reverse proxy like Nginx)
5. **Rotate secrets regularly** (Google OAuth, database passwords)

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
