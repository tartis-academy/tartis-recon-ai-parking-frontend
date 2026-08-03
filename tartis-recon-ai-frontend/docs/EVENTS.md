# Comunicación entre microfrontends

## Decisión

La comunicación de dominio entre el shell y los microfrontends se realizará mediante `CustomEvent` sobre `window`.

El bus expuesto por Module Federation (`exposes`) **no** será el mecanismo de comunicación de dominio. Se utilizará únicamente para capacidades técnicas que deben tener una única fuente de verdad, como `shell/AuthProvider` y `shell/keycloak`.

Esta decisión aplica únicamente a los dos microfrontends remotos existentes: `mfe-entryexit` y `mfe-admin`. *(Nota: `mfe-dashboard` fue descartado en la arquitectura final y no forma parte del ecosistema).*

## Por qué `CustomEvent`

| Criterio | `CustomEvent` sobre `window` | Bus expuesto por el shell |
|---|---|---|
| Acoplamiento | Bajo: depende de la API estándar del navegador | Alto: depende de Module Federation y de una API del shell |
| Ejecución standalone | Funciona sin cargar el shell | Requiere que el shell y su `remoteEntry` estén disponibles |
| Versionado | El contrato se versiona en este documento | El contrato queda implícito en una implementación compartida |
| Evolución | Un consumidor puede ignorar eventos que no conoce | Cambios del bus pueden romper remotes en runtime |
| Dependencias | No añade librerías ni duplicación de estado | Puede crear una dependencia runtime entre proyectos |
| Adecuación | Correcto para notificaciones y hechos ya ocurridos | Útil para capacidades síncronas del shell, no para dominio |

Los eventos son notificaciones, no llamadas RPC: no devuelven una respuesta ni deben usarse para coordinar operaciones críticas. Las operaciones de negocio continúan realizándose contra la API; el evento comunica que el resultado ya ocurrió.

## Modelo de integración

```text
Backend SSE (/v1/events)
        |
        v
Shell Host (Adapta y valida el evento)
        |
        v
window.dispatchEvent(new CustomEvent(...))
        |
        +--> mfe-admin      (invalida/recarga estancias, plazas, vehículos, tarifas)
        +--> mfe-entryexit  (actualiza plazas disponibles, tickets o estado visible)
```

Los nombres recibidos por SSE (`stay_updated`, `spot_updated`, etc.) son un contrato backend y no se reutilizan directamente como nombres DOM. El shell es el adaptador entre ambos límites.

## Convenciones del contrato

- Todos los nombres usan el prefijo `parking:` y kebab-case.
- El payload viaja en `event.detail`, nunca en propiedades añadidas al evento.
- Cada payload incluye `version`, `source` y `occurredAt`.
- `source` identifica al emisor (`shell`, `mfe-entryexit` o `mfe-admin`).
- `correlationId` se incluye cuando el evento procede de una operación de usuario o de una cadena de eventos.
- Los consumidores deben ignorar campos desconocidos para permitir evolución compatible.
- Un consumidor no debe mutar `event.detail` ni asumir que existe otro consumidor.
- Los nombres y campos son públicos dentro de la arquitectura: cualquier cambio incompatible requiere incrementar `version` y actualizar este archivo.

### Envoltorio común

```ts
interface ParkingEvent<T> {
  version: 1
  source: 'shell' | 'mfe-entryexit' | 'mfe-admin'
  occurredAt: string // ISO-8601 UTC
  correlationId?: string
  data: T
}
```

Publicar un evento desde un microfrontend:

```ts
window.dispatchEvent(
  new CustomEvent<ParkingEvent<CheckInCompletedData>>(
    'parking:check-in-completed',
    {
      detail: {
        version: 1,
        source: 'mfe-entryexit',
        occurredAt: new Date().toISOString(),
        data: payload,
      },
    },
  ),
)
```

Escuchar un evento en el Shell o un Remote:

```ts
const onCheckInCompleted = (event: Event) => {
  const customEv = event as CustomEvent<ParkingEvent<CheckInCompletedData>>
  if (!customEv.detail || customEv.detail.version !== 1) return
  
  const { data } = customEv.detail
  // Validar data e invalidar queries de TanStack Query
}

window.addEventListener('parking:check-in-completed', onCheckInCompleted)
```

Cada listener debe eliminarse al desmontar el componente. El consumidor no debe guardar el payload como estado global compartido; debe actualizar su propio estado o invalidar sus propias queries.

## Catálogo de eventos

### Eventos producidos por operaciones de usuario (Frontend MFEs)

| Evento | Payload `data` | Emisor | Consumidores |
|---|---|---|---|
| `parking:check-in-completed` | `{ stayId: string, plate: string, spotCode: string, entryDate: string }` | `mfe-entryexit` (post HTTP 201) | `mfe-admin` invalida estancias y plazas |
| `parking:check-out-completed` | `{ stayId: string, plate: string, amount: number, currency: string, exitDate: string }` | `mfe-entryexit` (post HTTP 200) | `mfe-admin` invalida estancias y tickets |

Estos eventos no sustituyen la publicación backend. Son una señal inmediata para la experiencia de usuario del navegador; la fuente de verdad sigue siendo la API y los eventos SSE del backend.

### Eventos de sincronización recibidos desde SSE (Adaptados por el Shell)

El shell los publica como `CustomEvent` en `window` después de recibir y procesar el evento SSE correspondiente.

| Evento DOM | Evento SSE origen | Payload `data` | Emisor | Consumidores |
|---|---|---|---|---|
| `parking:stay-updated` | `stay_updated` | `{ stayId?: string, plate?: string, status?: string }` | Shell (adaptando `stay-service`) | `mfe-admin` |
| `parking:spot-updated` | `spot_updated` | `{ spotId?: string, spotCode?: string, status?: string }` | Shell (adaptando `spot-service`) | `mfe-admin`, `mfe-entryexit` |
| `parking:vehicle-updated` | `vehicle_updated` | `{ vehicleId?: string, plate?: string }` | Shell (adaptando `vehicle-service`) | `mfe-admin` |
| `parking:ticket-updated` | `ticket_updated` | `{ ticketId?: string, stayId?: string, status?: string }` | Shell (adaptando `ticket-service`) | `mfe-admin` |
| `parking:entry-ticket-updated` | `entry_ticket_updated` | `{ ticketId?: string, stayId?: string, plate?: string }` | Shell (adaptando `ticket-service`) | `mfe-entryexit`, `mfe-admin` |

## Responsabilidades

### Shell Host (`tartis-recon-ai-parking-frontend`)

- Mantener la conexión SSE con `GET /v1/events` (`use-sse.ts`).
- Validar el nombre, la versión y la forma mínima del payload.
- Traducir eventos SSE a nombres `parking:*` y despacharlos en `window`.
- Invalida sus propias queries internas de TanStack Query si requiere re-render.
- No mantener un store de dominio compartido entre remotes.
- Mantener los contratos técnicos federados de autenticación (`AuthProvider`, `keycloak`).

### Microfrontends Remotos (`mfe-entryexit` y `mfe-admin`)

- Emitir únicamente los eventos de usuario que figuran en este catálogo (`parking:check-in-completed`, `parking:check-out-completed`).
- Consumir solo los eventos necesarios para su propia experiencia mediante `addEventListener`.
- Invalidar sus queries o actualizar su estado local al recibir un evento.
- No importar código de otro microfrontend para comunicarse.
- Seguir funcionando en modo standalone; si el shell no está presente, la operación principal no debe fallar por la ausencia de consumidores.

## No usar este mecanismo para

- Compartir tokens, credenciales o datos sensibles (eso se resuelve vía `shell/AuthProvider`).
- Hacer llamadas síncronas esperando una respuesta de otro microfrontend.
- Coordinar transacciones de entrada, salida, cobro u ocupación de plazas.
- Replicar un store global entre repositorios independientes.
- Emitir eventos con objetos de dominio completos cuando bastan identificadores.

## Estado actual vs Repositorio real y `Notas Última Semana.md`

### 1. `mfe-dashboard` fue eliminado
En [`Notas Última Semana.md`](file:///C:/Users/jhony/Desktop/GRE/Ingeniero%20Software/Notas%20%C3%9Altima%20Semana.md) se establece claramente:
> *"mfe-dashboard era opcional y no se creó. No se debe fabricar un contenedor vacío para simular un cuarto microfrontend."*

Por lo tanto, la arquitectura real solo cuenta con tres componentes frontend: **Shell Host**, **`mfe-entryexit`** y **`mfe-admin`**. El catálogo de este documento fue depurado para reflejar esta realidad.

### 2. Brecha actual en el código (`tartis-recon-ai-frontend/src/lib/use-sse.ts`)
Al inspeccionar el repositorio real en `c:\Development\tartis-recon-ai-parking-frontend`:
- `use-sse.ts` actualmente escucha los eventos SSE del backend e invalida TanStack Query internamente dentro del Shell mediante `queryClient.invalidateQueries`.
- **Pendiente**: El Shell aún no ejecuta `window.dispatchEvent` para reenviar los eventos `parking:*` hacia `window`, ni los remotos (`mfe-entryexit` y `mfe-admin`) tienen instanciados los `addEventListener` correspondientes.

### 3. Plan de acción para cerrar la brecha
1. En `use-sse.ts` del Shell, agregar `window.dispatchEvent(new CustomEvent('parking:...'))` al recibir cada evento SSE.
2. En `mfe-entryexit`, despachar `parking:check-in-completed` y `parking:check-out-completed` al recibir la respuesta de la API.
3. En `mfe-admin` y `mfe-entryexit`, agregar listeners de `window` con limpieza en el desmonte de componentes.
