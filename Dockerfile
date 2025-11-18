# Use Node.js LTS version (Debian-based for better Prisma compatibility)
FROM node:20-slim

# Install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (use --omit=dev instead of --only=production)
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start application
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm start"]
