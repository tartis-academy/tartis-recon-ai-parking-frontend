# ADR 001: Selección de Herramienta de Module Federation para la Fase II

* **Estado:** Aprobado
* **Fecha:** 2026-07-29
* **Autor:** Arquitectura Frontend (TARTIS Recon-AI)

---

## 1. Contexto y Problema

Durante la Fase II del programa TARTIS Recon-AI, se definió la migración del frontend hacia una arquitectura de Microfrontends (MFEs) compuesta por un Shell Host y múltiples módulos remotos (`mfe-entryexit`, `mfe-admin`, `mfe-dashboard`).

El proyecto original está construido sobre la plantilla oficial de la organización utilizando **Vite + React 18 + TypeScript**. Vite no soporta Module Federation de forma nativa (a diferencia de Webpack), por lo que fue necesario evaluar la herramienta idónea para habilitar Module Federation sin comprometer la estabilidad del arquetipo.

Se evaluaron dos alternativas principales:
1. **Opción A (`@originjs/vite-plugin-federation`):** Plugin de integración de Module Federation para Vite.
2. **Opción B (`Rsbuild / Rspack`):** Migración completa del *bundler* a Rsbuild para utilizar Module Federation v2 nativo.

---

## 2. Evaluación empírica (PoC ejecutada)

Se realizó una Prueba de Concepto (PoC) técnica configurando un **Host** y un **Remote** independientes:

* **Generación de artefactos:** `@originjs/vite-plugin-federation` generó correctamente el manifiesto `remoteEntry.js` (3.01 kB) en menos de 500ms sin alterar el compilador de Vite.
* **Compartición de dependencias (*Shared Dependencies*):** React y React-DOM fueron aislados y compartidos correctamente mediante chunks dinámicos (`__federation_shared_react.js`).
* **Carga en el Shell:** El Shell resolvió el remoto expuesto `./RemoteWidget` mediante `<React.Suspense>` y `React.lazy()` en tiempo de ejecución.

---

## 3. Decisión Adoptada

Se decide adoptar **Opción A: `@originjs/vite-plugin-federation`**.

### Justificación Técnica:
1. **Preservación del Arquetipo Vite:** Mantiene el stack estándar de la compañía (Vite + React 18 + TS), evitando refactorizar los scripts de *build*, la configuración de plugins y los pipelines de CI/CD ya consolidados en la Fase I.
2. **Cero impacto en desarrolladores:** No requiere que el equipo aprenda la configuración ni la sintaxis de Rsbuild/Rspack a mitad de programa.
3. **Desempeño demostrado:** La PoC confirmó que el bundle resultante expone de forma limpia `remoteEntry.js` y que el Shell lo consume sin inconvenientes.

---

## 4. Consecuencias

* **Consecuencias Positivas:**
  * Se mantiene la velocidad de compilación y Hot Module Replacement (HMR) nativo de Vite.
  * Desbloquea de inmediato la tarea **FSH-02** para la creación del arquetipo de los repositorios remotos.

* **Mitigación de Riesgos:**
  * Para solucionar advertencias de tipado en TypeScript durante el *build* (`tsc`), se agrega `@ts-ignore` en las declaraciones de importación dinámica de los remotos en el Shell o se define un archivo de declaración ambiental `src/remotes.d.ts`.
