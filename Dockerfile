FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --no-audit --no-fund

COPY . .

RUN npm run build


FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache dumb-init

COPY package*.json ./

RUN npm install --omit=dev --no-audit --no-fund

COPY --from=builder /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/main"]