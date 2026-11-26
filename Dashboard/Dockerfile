# ==============================================================================
# Dockerfile Multi-Stage — 100% Open Source y Agnóstico de Servidor
# Datatón INE 2026 — Grupo 2: Análisis de Datos (ENAPROM 2025)
# ==============================================================================

# Etapa 1: Compilación de la aplicación React + TypeScript + Tailwind CSS
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Servidor Web Ligero Open Source (NGINX Alpine)
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
