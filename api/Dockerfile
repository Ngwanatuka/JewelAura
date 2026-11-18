FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose the API port (default 5000)
EXPOSE 5000

# Ensure uploads directory exists and is owned by appuser
RUN mkdir -p /app/uploads && addgroup -S appgroup && adduser -S appuser -G appgroup && chown -R appuser:appgroup /app/uploads
USER appuser

# Start the server in production mode (not nodemon)
CMD ["node", "index.js"]