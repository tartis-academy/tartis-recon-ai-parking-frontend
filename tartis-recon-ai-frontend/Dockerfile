# Multi-stage: build de la SPA con Node y luego se sirve el estatico con
# nginx, que ademas hace de reverse proxy hacia los microservicios (el
# frontend solo conoce un VITE_API_BASE_URL relativo y llama a rutas /v1/*).

# --- build ---
FROM node:20-alpine AS build
WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Relativo: nginx resuelve /v1/* contra el microservicio correcto (ver nginx.conf).
ENV VITE_API_BASE_URL=""
RUN npm run build

# --- runtime ---
# RECON-813: 1.27-alpine trae CVE-2026-31789 (CRITICAL, OpenSSL heap
# overflow) ya con fix en Alpine; 1.29-alpine la incorpora.
FROM nginx:1.29-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html

EXPOSE 80
