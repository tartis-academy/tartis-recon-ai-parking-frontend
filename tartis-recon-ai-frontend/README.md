# TARTIS Recon-AI Parking — Frontend Shell Host

Este repositorio es el **Host / Shell principal** que orquesta la plataforma web de control y gestión de aparcamientos **TARTIS Recon-AI Parking**.

A través de una arquitectura basada en **Microfrontends (Module Federation)**, el Shell Host actúa como contenedor principal integrando dinámicamente los módulos de administración y de control de entrada/salida.

---

## 🚀 Inicio Rápido (Desarrollo)

### Requisitos previos
- Node.js (v18+ recomendado)
- `npm` o `pnpm`

### Comandos de desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar el Shell Host en modo desarrollo (puerto 3000 por defecto)
npm run dev

# Construir la aplicación para producción
npm run build

# Previsualizar el build de producción
npm run preview
```

---

## 🧩 Arquitectura de Microfrontends (Remotes Consumidos)

El Shell Host expone utilidades globales (`AuthProvider`, estado de sesión) e integra los siguientes microfrontends remotos:

| Módulo Remoto | Variable de Entorno / URL | Puerto Dev | Descripción |
|---|---|---|---|
| **`mfeAdmin`** | `VITE_MFE_ADMIN_URL` | 3001 | Panel de administración global, usuarios y analítica. |
| **`mfeEntryExit`** | `VITE_MFE_ENTRYEXIT_URL` | 3002 | Control de accesos de vehículos en tiempo real y barreras. |

---

## 📚 Documentación del Proyecto

Toda la documentación técnica del proyecto se encuentra organizada bajo la carpeta [`docs/`](docs/README.md):

- **[📖 Índice Maestro de Documentación](docs/README.md)**: Política de releases, historial de cambios de alcance e índice global.
- **[🚀 Fase II Activa (v2)](docs/v2/README.md)**: Arquitectura actual de Microfrontends, guía de despliegue y estándares de desarrollo.
- **[📜 Fase I Histórica (v1)](docs/v1/README.md)**: Documentación del MVP inicial y versión histórica.

---

## 🛡️ Escaneo de imagen (Trivy)

El job `docker-scan` de la CI construye la imagen final del Dockerfile (build de Vite servido por nginx) y la escanea con [Trivy](https://trivy.dev/). El informe completo (`CRITICAL` + `HIGH`) se publica siempre en la pestaña **Security** del repo; solo una vulnerabilidad `CRITICAL` hace fallar el job.

Si una `CRITICAL` no tiene fix disponible todavía y hay que aceptar el riesgo de forma consciente, se ignora explícitamente añadiendo su CVE a un `.trivyignore` en la raíz del repo.
