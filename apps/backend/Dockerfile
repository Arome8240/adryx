# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (regenerate lockfile if needed)
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

# Install pnpm, wget, and build dependencies for native modules
RUN npm install -g pnpm && \
    apk add --no-cache wget python3 make g++

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies and rebuild native modules
RUN pnpm install --prod && pnpm rebuild bcrypt

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/main.js"]
