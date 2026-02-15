FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY server ./server
COPY README.md ./README.md

RUN npx prisma generate --schema server/models/prisma/schema.prisma \
  && npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 5001
CMD ["node", "server/index.js"]
