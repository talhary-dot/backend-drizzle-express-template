# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy source code
COPY . .

# Generate Drizzle migrations
RUN npm run drizzle:generate

# Production stage
FROM node:24-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm i

# Copy necessary files from builder
COPY --from=builder /app/src ./src
COPY --from=builder /app/libs ./libs
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/status', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "start"]
