FROM node:20-alpine

# Install pnpm and build dependencies
RUN npm install -g pnpm && \
    apk add --no-cache wget python3 make g++

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/src/main.js"]
