# ==============================================================================
# Stage 1: Build de Producao do Ionic + Angular Standalone
# ==============================================================================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# ==============================================================================
# Stage 2: Servidor Nginx servindo SPA + Proxy Reverso /api -> backend:8082
# ==============================================================================
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/www /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
