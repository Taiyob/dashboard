# --- Stage 1: Builder ---
# Use the official Bun image as a base for building the app
FROM oven/bun:latest AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb (Bun's lockfile)
COPY package.json ./

# Install dependencies using the frozen lockfile
# 1. Install production deps
RUN bun install --frozen-lockfile --production

# 2. ADD THIS LINE: Explicitly install typescript for next.config.ts support
RUN bun add -d typescript

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN bun run build


# --- Stage 2: Runner ---
# Use a fresh Bun image for the final, lean production image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_PACKAGE_MANAGER=bun

# Copy only the necessary production dependencies configuration
COPY --from=builder /app/package.json ./package.json

# Install *only* production dependencies
RUN bun install --frozen-lockfile --production && \
  bun add -d typescript

# Copy the built Next.js application assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose the port the app will run on
EXPOSE 3000

# The command to start the Next.js server using Bun
CMD ["bun", "run", "start"]
