# Step 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for the build)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Run the build script (Vite bundle + server compilation)
RUN npm run build

# Step 2: Runtime stage
FROM node:20-alpine

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy package files
COPY package*.json ./

# Only install production dependencies
RUN npm ci --only=production

# Copy built assets and server binary from builder stage
COPY --from=builder /app/dist ./dist

# Expose the server port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
