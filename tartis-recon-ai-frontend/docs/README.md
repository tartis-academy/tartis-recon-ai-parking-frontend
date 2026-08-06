# 📚 Documentación Técnica — `tartis-recon-ai-parking-frontend-shell`

Bienvenido al índice maestro de documentación del **Host / Shell principal** de la plataforma **TARTIS Recon-AI Parking**.

Este directorio centraliza la historia técnica, las guías de arquitectura y las directrices de desarrollo y despliegue del proyecto.

---

## 📌 Política de Releases y Versionado de Documentación

La documentación está organizada por directorios de versión (`v1/`, `v2/`). Cada carpeta representa un **snapshot congelado o activo** del sistema correspondiente al cierre y evolución de cada fase del proyecto:

- **`docs/v1/`**: Documentación histórica congelada correspondiente a la **Fase I** (MVP inicial).
- **`docs/v2/`**: Documentación activa y vigente correspondiente a la **Fase II** (Arquitectura actual de Microfrontends).

---

## 💡 Justificación del Cambio de Alcance (v1 ➔ v2)

> [!NOTE]  
> La carpeta `docs/v2/` fue creada debido a la **Propuesta de Cambio de Alcance** aprobada para la Fase II. Esta propuesta evolucionó el frontend monolítico inicial de la Fase I hacia una arquitectura desacoplada y escalable de **Microfrontends (Module Federation)**, compuesta por un `Shell Host` principal y módulos remotos especializados (`MFE Admin` y `MFE EntryExit`).

---

## 🗺️ Tabla de Correspondencia del Ecosistema

La siguiente tabla refleja la correlación entre las versiones de documentación del Shell Host y los repositorios remotos del ecosistema TARTIS:

| Versión Doc | Fase del Proyecto | Rol del Repositorio | Integraciones del Ecosistema | Estado |
|---|---|---|---|---|
| **[`docs/v1/`](v1/README.md)** | **Fase I** | Monolito MVP inicial | Aplicación autónoma sin remotes | 🧊 Congelado (Histórico) |
| **[`docs/v2/`](v2/README.md)** | **Fase II** | Shell / Host Orquestador | Consume `MFE Admin v1` y `MFE EntryExit v1` mediante Module Federation y Kong | 🟢 Activo (Vigente) |

---

## 📂 Navegación Directa

- 📜 **[Fase I (v1) - Documentación Histórica](v1/README.md)**
  - [Guía de Despliegue v1](v1/DEPLOYMENT.md)
  - [Guía de Desarrollo v1](v1/GUIDELINE.md)
- 🚀 **[Fase II (v2) - Documentación Activa](v2/README.md)**
  - [Guía de Despliegue v2 (Module Federation + Kong)](v2/DEPLOYMENT.md)
  - [Guía de Desarrollo v2 (Bulletproof React + Tailwind v4)](v2/GUIDELINE.md)
