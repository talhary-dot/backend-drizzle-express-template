# Base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package.json first to leverage Docker cache for dependencies
COPY package.json ./

# Install all dependencies (including devDependencies for tsx)
RUN npm install

# Copy the bundled code, migrations, and migration script
COPY dist/ ./dist/
COPY libs/ ./libs/
COPY drizzle/ ./drizzle/
COPY .env ./

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
