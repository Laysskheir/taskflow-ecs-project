# Build stage: compile the TypeScript application.
FROM node:24-alpine AS build

WORKDIR /app

RUN corepack enable pnpm && corepack prepare pnpm@9.12.1 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile \
    --fetch-retries=5 \
    --fetch-timeout=120000 \
    --network-concurrency=4

COPY . .

RUN pnpm build


# Install production dependencies only.
FROM node:24-alpine AS production-deps

WORKDIR /app

RUN corepack enable pnpm && corepack prepare pnpm@9.12.1 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile \
    --fetch-retries=5 \
    --fetch-timeout=120000 \
    --network-concurrency=8


# Production runtime image.
FROM node:24-alpine AS production

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=production-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./package.json

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health/live').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "dist/main.js"]