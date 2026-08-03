# ADR 002: Contrato del payload SSE `stay_updated` — adaptar el parseo en frontend

* **Estado:** Propuesto
* **Fecha:** 2026-08-03
* **Autor:** DevOps (TARTIS Recon-AI) — a validar con el equipo de Frontend antes de pasar a Aprobado

---

## 1. Contexto y Problema

`stay-service` expone `GET /v1/events` (SSE-01/SSE-02, ver `docs/adr/0001-sse-endpoint-en-stay-service.md` del repo `stay-service`) y ya está mergeado en `release` y `release123`. El hook `useSseNotifications` (`src/lib/use-sse.ts`) se implementó en frontend **antes** de que ese endpoint existiera. El nombre del evento (`stay_updated`) coincidió, pero el payload no se acordó formalmente entre ambos equipos (ver `Convenciones del proyecto Parking.md` §11 del vault de backend), y al contrastar el código real de los dos lados aparece un desajuste de forma, no solo de nombre.

**Lo que manda `stay-service`** (evento SSE `event:stay_updated`, documentado en su `openapi.yml`):

```json
{
  "eventId": "b3f1...",
  "type": "StayClosedEvent",
  "version": "v1",
  "occurredAt": "2026-08-03T10:00:00Z",
  "data": {
    "stayId": "...", "spotId": "...", "plate": "1234ABC",
    "entryDate": "...", "exitDate": "...", "totalAmount": 5.00
  }
}
```

Además, desde el 2026-08-03 el evento lleva `id:` (línea del protocolo SSE, mismo valor que `eventId`) para soportar `Last-Event-ID` en reconexión.

**Lo que espera `use-sse.ts`** (`SseEventPayload`):

```ts
export interface SseEventPayload {
  id?: string
  eventType?: string
  type?: ToastType   // 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string    // obligatorio
}
```

`handleSseEvent` construye el toast con `message: data.message` y `type: data.type || (eventType ? 'success' : 'info')`.

### Consecuencia actual, sin fix

El listener sí engancha (`eventSource.addEventListener('stay_updated', ...)` coincide con el nombre real emitido) y el toast sí se dispara, pero:

- `data.message` es `undefined` en el payload real → el toast sale sin cuerpo de mensaje.
- `data.type` es la cadena `"StayClosedEvent"`, que no es ningún `ToastType` válido. `ToastItem.tsx` hace `switch (toast.type)` con `case 'success' | 'error' | 'warning'` y `default` → cae al styling de `info` en vez de al de `success`, sin avisar de que el valor no encajó.
- `data.id` (el campo del JSON) no existe con ese nombre — el `id` real del evento es `eventId`. Y el `id:` de reconexión que ya manda el servidor a nivel de protocolo SSE (`event.lastEventId`) no lo lee el hook en ningún sitio: la reconexión no recupera contexto aunque el backend ya lo soporte.

No es un crash — es degradación silenciosa: el usuario ve una notificación gris genérica sin texto en vez de "Vehículo 1234ABC ha salido, plaza liberada".

---

## 2. Opciones evaluadas

**Opción A — Backend aplana el payload a la forma que espera el toast** (`stay-service` añade `message`/`title`/`type` ya traducidos).
Implica meter texto de presentación en español y reglas de UI (qué `ToastType` usar) dentro de `stay-service`, que ya tiene el contrato `StayClosedEvent` documentado y **mergeado dos veces** (`release` y `release123`, PR #82/#84). Cualquier cambio de forma exige repetir el mismo proceso de dos PRs por el que ya se pasó hoy. Rompe además la separación domain/presentación: el backend no debería decidir cómo se redacta un toast.

**Opción B — Frontend adapta el parseo para consumir el envelope real** (`eventId`/`type`/`data`), construyendo `message`/`title`/`type` de UI localmente.
Un solo repo, un solo cambio, y el sitio natural para el texto ya existe: `notificationLabels` (`src/app/labels.ts`) es exactamente el fichero de copys en español para notificaciones SSE (ya tiene `sseConnected`, `sseReconnecting`, etc.). De paso, permite empezar a leer `event.lastEventId` en vez de un `id` inexistente en el JSON, aprovechando el fix de reconexión que el backend ya tiene en producción.

---

## 3. Decisión Adoptada

Se propone **Opción B**: adaptar `use-sse.ts` para consumir el envelope real de `stay-service`, sin tocar el backend.

### Cambios concretos propuestos en `src/lib/use-sse.ts`

1. Al parsear `event.data`, tratar el JSON como el envelope real (`eventId`, `type`, `version`, `occurredAt`, `data`), no como `SseEventPayload` plano.
2. Añadir una función de mapeo por `eventType` (junto a `EVENT_QUERY_MAP`) que construya `title`/`message` a partir de `data.data` (p. ej. para `stay_updated`: `` `Vehículo ${plate} ha salido, plaza liberada` ``), usando nuevas entradas en `notificationLabels`.
3. Fijar `type: 'success'` explícito para `stay_updated` en vez de reenviar el `type` de dominio del backend (que no es un `ToastType`).
4. Usar `event.lastEventId` como `id` del toast/reconexión en vez de un campo `id` que el JSON no trae.

### Justificación

1. **Cero cambios en backend**: el contrato de `stay-service` ya está documentado, testeado y mergeado en las dos ramas activas (`release`/`release123`); reabrirlo cuesta más que adaptar un hook.
2. **El sitio correcto para la copy ya existe**: `notificationLabels` es responsabilidad de frontend, no de backend — consistente con no mezclar dominio y presentación (mismo principio que ya aplica el backend en su arquitectura hexagonal).
3. **Desbloquea la reconexión real**: `event.lastEventId` ya lo manda el servidor; hoy no lo usa nadie.

---

## 4. Consecuencias

* **Consecuencias positivas:**
  * Los toasts de `stay_updated` muestran información real (matrícula, plaza) en vez de salir vacíos.
  * El estilo del toast (`success`/`info`/...) deja de depender de que el backend mande un `ToastType` válido por accidente.
  * La reconexión SSE queda lista para usar `Last-Event-ID` de verdad.

* **Riesgos / a validar con el equipo de front antes de pasar a "Aprobado":**
  * Los próximos eventos de dominio (entrada de vehículo, cambio de tarifa, cambio de plaza — pendientes en backend) tendrán que seguir el mismo envelope (`eventId`/`type`/`data`); esta ADR fija el patrón de parseo también para ellos, no solo para `stay_updated`.
  * Requiere que quien mantiene `use-sse.ts` (Gabo-Dev) confirme el mapeo de campos y el texto propuesto antes de implementar — este documento es la propuesta, no el acuerdo cerrado (ver `Convenciones del proyecto Parking.md` §11 en el vault de `stay-service`).
