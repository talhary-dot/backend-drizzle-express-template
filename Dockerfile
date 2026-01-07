# Base image: node:22-alpine is very small (~45MB)
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy the bundled code
# We only need the dist folder and .env
COPY dist/ ./dist/
COPY package.json ./
COPY .env ./

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
