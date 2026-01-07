# Base image: node:22-alpine is very small (~45MB)
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy the bundled code
# We only need the dist folder and .env
COPY dist/ ./dist/
COPY .env ./

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.cjs"]
