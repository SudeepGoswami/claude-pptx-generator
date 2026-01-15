FROM node:20-slim

WORKDIR /app

# Copy package files
COPY api/package*.json ./api/

# Install dependencies
WORKDIR /app/api
RUN npm install --production

# Copy API source code
COPY api/src ./src

# Copy prompts, templates, and brand assets from parent directory
WORKDIR /app
COPY *.md ./
COPY *.html ./
COPY *.json ./
COPY *.css ./
COPY *.png ./

# Create output directory
RUN mkdir -p /app/api/output

WORKDIR /app/api

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV OUTPUT_DIR=/app/api/output

EXPOSE 3000

CMD ["node", "src/index.js"]
