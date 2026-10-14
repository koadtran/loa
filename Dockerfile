# 1. frontend-build — vite build → dist

FROM node:20-slim AS frontend-build
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# 2. server-deps — install deps + Prisma client
FROM node:20-slim AS server-deps
WORKDIR /app/server

# Prisma needs OpenSSL at runtime too.
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY server/package.json server/package-lock.json ./
# Copy schema before `npm ci` so a `postinstall: prisma generate` would work.
COPY server/prisma ./prisma

RUN npm ci
# Belt-and-braces: generate explicitly in case there's no postinstall hook.
RUN npx prisma generate --schema prisma/schema.prisma

# 3. runner — slim runtime
FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    PORT=3000

RUN groupadd -r loa && useradd -r -g loa -m -d /home/loa loa

# Server code + node_modules (with the generated Prisma client).
COPY --from=server-deps --chown=loa:loa /app/server/node_modules ./server/node_modules
COPY --chown=loa:loa server ./server

# Built frontend — served by Express under production.
COPY --from=frontend-build --chown=loa:loa /app/frontend/dist ./frontend/dist

USER loa
EXPOSE 3000

# Apply any pending migrations, then boot.
# (`cd server` so npx finds prisma in server/node_modules/.bin)
CMD ["sh", "-c", "cd server && npx prisma migrate deploy && node server.js"]