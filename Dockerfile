# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Instalar dumb-init para lidar com sinais corretamente
RUN apk add --no-cache dumb-init

# Copiar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# Copiar build da aplicação do stage anterior
COPY --from=builder /app/dist ./dist

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Usar dumb-init para evitar problemas com sinais
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
