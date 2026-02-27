# --- Stage 1: Builder ---
# Use the official Bun image as a base for building the app
FROM oven/bun:latest AS builder

# Set the working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies using the frozen lockfile
# We install all dependencies (including dev) to ensure tsc and vite are available for build
RUN bun install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the Vite application
RUN bun run build

# --- Stage 2: Runner ---
# Use Nginx to serve the static Vite bundle
FROM nginx:alpine

# Copy the built Vite application assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: if you have a custom nginx.conf or need client-side routing, you might need an nginx config.
# For standard React app with React Router, a simple configuration is usually needed, 
# but for basic usage the default nginx setup might work. If React Router history mode is used,
# uncomment the specific commands below to provide a fallback to index.html.

RUN echo "server { \
    listen 80; \
    location / { \
        root   /usr/share/nginx/html; \
        index  index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# The command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
