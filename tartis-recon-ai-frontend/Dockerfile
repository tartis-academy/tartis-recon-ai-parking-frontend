# Multi-stage: build de la SPA con Node y luego se sirve el estatico con
# nginx, que ademas reenvia las llamadas de API hacia Kong (el frontend solo
# conoce un VITE_API_BASE_URL relativo y llama a rutas /v1/*; nginx las
# traduce a las /api/v1/* del gateway, ver nginx.conf).

# --- build ---
FROM node:20-alpine AS build
WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Relativo: nginx reenvia /v1/* a Kong, que valida el JWT y enruta al
# microservicio correcto (ver nginx.conf).
ENV VITE_API_BASE_URL=""
RUN npm run build

# --- runtime ---
# RECON-813: 1.27-alpine trae CVE-2026-31789 (CRITICAL, OpenSSL heap
# overflow) ya con fix en Alpine; 1.29-alpine la incorpora.
FROM nginx:1.29-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html

EXPOSE 80
