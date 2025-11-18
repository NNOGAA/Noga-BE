# Use Node.js LTS version (Debian-based for better Prisma compatibility)
FROM node:20-slim

# Install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Set Prisma environment variable to ignore checksum errors
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (use --omit=dev instead of --only=production)
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Generate Prisma client and start application
CMD ["sh", "-c", "npx prisma generate && npx prisma db push --accept-data-loss && node app.js"]
