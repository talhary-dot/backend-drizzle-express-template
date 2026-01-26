# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run drizzle:generate 
# If you have a build step (e.g. tsc), run it here. 
# Since this uses node --experimental-strip-types, we might not need to compile TS for runtime if node 22+ supports it. 
# But this template seems to rely on node versions that support it or assumes dev mode.
# For production, it's safer to compile or ensure the node version is recent.
# The template package.json uses "start": "node --experimental-strip-types ... src/server.ts".
# This requires Node 22.6.0+.

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/libs ./libs
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

EXPOSE 3000

CMD ["npm", "start"]
