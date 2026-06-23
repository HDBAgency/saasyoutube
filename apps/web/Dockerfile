FROM node:20-slim AS base
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg \
    && pip3 install yt-dlp --break-system-packages \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/db/package.json ./packages/db/
COPY apps/web/package.json ./apps/web/
RUN npm install

# Copy source
COPY packages/shared ./packages/shared
COPY packages/db ./packages/db
COPY apps/web ./apps/web

# Generate Prisma client
RUN cd packages/db && npx prisma generate

# Build
RUN npm run build -w apps/web

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "run", "start", "-w", "apps/web"]
