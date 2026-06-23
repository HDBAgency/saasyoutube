FROM node:20-slim
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg \
    && pip3 install yt-dlp --break-system-packages \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/db/package.json ./packages/db/
COPY apps/worker/package.json ./apps/worker/
RUN npm install

COPY packages/shared ./packages/shared
COPY packages/db ./packages/db
COPY apps/worker ./apps/worker

RUN cd packages/db && npx prisma generate
RUN npm run build -w apps/worker

ENV NODE_ENV=production
CMD ["npm", "run", "start", "-w", "apps/worker"]
