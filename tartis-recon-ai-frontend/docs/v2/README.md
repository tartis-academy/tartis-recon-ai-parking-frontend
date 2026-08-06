# 🚀 Fase II — Documentación Activa (Release v2)

Bienvenido a la documentación oficial de la **Fase II (Release v2)** del repositorio **`tartis-recon-ai-parking-frontend-shell`**.

Este directorio contiene todas las especificaciones, directrices de arquitectura y guías de desarrollo y despliegue vigentes para el **Shell Host / Orquestador Global** de la plataforma TARTIS Recon-AI Parking.

---

## 🏗️ Arquitectura de Orquestación (Shell Host)

En la Fase II, el frontend evoluciona desde el monolito inicial hacia una arquitectura desacoplada de **Microfrontends (Module Federation)**:

```
                          ┌────────────────────────┐
                          │   Kong API Gateway     │
                          └───────────┬────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
   ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
   │    Shell Host      │  │     MFE Admin      │  │   MFE EntryExit    │
   │  (Puerto 3000)     │  │   (Puerto 3001)    │  │   (Puerto 3002)    │
   └──────────┬─────────┘  └────────────────────┘  └────────────────────┘
              │                       ▲                       ▲
              └───────────────────────┴───────────────────────┘
                        Module Federation (Remote Entry)
```

### Funciones Principales del Shell Host:
1. **Orquestación de Rutas**: Renderizado de la estructura base (layout, navegaciones superiores e integradas).
2. **Proveedor de Autenticación**: Expone `AuthProvider` y la instancia de `keycloak` a través de Module Federation hacia los remotes.
3. **Integración Dinámica**: Consume `remoteEntry.js` de `mfeAdmin` y `mfeEntryExit`.

---

## 📑 Guías Técnicas de Fase II

- **[🛠️ Guía de Despliegue v2](DEPLOYMENT.md)**: Especificaciones de Docker, Module Federation (`remoteEntry.js`), variables de entorno y contrato de rutas en Kong API Gateway.
- **[📐 Guía de Desarrollo v2](GUIDELINE.md)**: Estándares de arquitectura (*Bulletproof React*), stack tecnológico (Tailwind CSS v4, TanStack Router/Query, Zustand), reglas mecánicas con `ripgrep` y buenas prácticas.

---

> [!TIP]  
> Para consultar la historia y documentación del MVP original de la Fase I, dirígete a **[`docs/v1/`](../v1/README.md)**.
