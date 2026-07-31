# Multi-stage: build de la SPA con Node y luego se sirve el estatico con
# nginx, que ademas hace de reverse proxy hacia los microservicios (el
# frontend solo conoce un VITE_API_BASE_URL relativo y llama a rutas /v1/*).

# --- build ---
FROM node:20-alpine AS build
WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Relativo: nginx resuelve /v1/* contra Kong (ver nginx.conf).
ENV VITE_API_BASE_URL=""
# URLs públicas de los remotos (host expuesto por su propio nginx, no el
# puerto interno del contenedor) — se hornean en el remoteEntry.js en build time.
ARG VITE_MFE_ENTRYEXIT_URL=http://localhost:5001/assets/remoteEntry.js
ARG VITE_MFE_ADMIN_URL=http://localhost:5002/assets/remoteEntry.js
ENV VITE_MFE_ENTRYEXIT_URL=$VITE_MFE_ENTRYEXIT_URL
ENV VITE_MFE_ADMIN_URL=$VITE_MFE_ADMIN_URL
RUN npm run build

# --- runtime ---
# RECON-813: 1.27-alpine trae CVE-2026-31789 (CRITICAL, OpenSSL heap
# overflow) ya con fix en Alpine; 1.29-alpine la incorpora.
FROM nginx:1.29-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html

EXPOSE 80
