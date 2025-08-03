# -------- Build stage --------
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY postcss.config.mjs ./
COPY next.config.ts ./
COPY public ./public
COPY src ./src

RUN npm install
RUN npm run build

# -------- Production stage --------
FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["npm", "start"]
