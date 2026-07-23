# Guideline — Tartis Frontend

Fuente de la verdad para contribuciones al frontend de Tartis. Este documento es **ejecutable**: cada regla incluye un comando `rg` (ripgrep) que la verifica mecánicamente. Si un agente de IA asiste a un compañero, **debe respetar este guideline por encima de cualquier suposición propia**.


---

## 1. Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | React | 18.3.1 |
| Lenguaje | TypeScript (strict) | 6.0.2 |
| Build | Vite | 8.1.1 |
| Estilos | Tailwind CSS v4 (con `@theme`) | 4.3.2 |
| Routing | TanStack Router | 1.170.18 |
| Server state | TanStack Query | 5.101.2 |
| UI state global | Zustand | 5.0.14 |
| Forms | react-hook-form + zod | 7.81.0 / 4.4.3 |
| HTTP | axios | 1.18.1 |
| Mocks | msw | 2.15.0 |
| Tests | vitest + Testing Library | 4.1.10 / 16.3.2 |

**Regla**: no añadir dependencias sin discutirlo. La base ya cubre los casos conocidos.

---

## 2. Estructura de carpetas

```
tartis-recon-ai-frontend/
├── docs/
│   └── GUIDELINE.md         ← este archivo
├── public/                  ← assets estáticos
├── src/
│   ├── app/                 ← router, providers, composición raíz
│   ├── features/
│   │   └── <feature>/       ← una carpeta por feature
│   │       ├── api/         ← llamadas axios
│   │       ├── components/  ← presentacionales puros
│   │       ├── containers/  ← inteligentes (fetch, state, orquestación)
│   │       ├── hooks/       ← hooks específicos del feature
│   │       ├── stores/      ← zustand stores del feature
│   │       ├── types/       ← tipos del feature
│   │       ├── validation/  ← zod schemas
│   │       ├── pages/       ← rutas (delegan en containers)
│   │       ├── labels.ts    ← strings de UI en español
│   │       ├── constants.ts ← magic numbers y configuración
│   │       └── index.ts     ← barrel export
│   ├── lib/                 ← utilidades cross-cutting
│   ├── shared/
│   │   └── ui/              ← componentes presentacionales reusables
│   └── testing/             ← msw handlers y setup
└── ...
```

**Regla**: una feature nueva = carpeta nueva en `features/`. No añadir archivos sueltos en `src/` que no pertenezcan a una feature.

---

## 3. Arquitectura bulletproof

El proyecto sigue arquitectura por features con separación de capas. **Cada archivo tiene una responsabilidad clara**.

### 3.1 Qué va dónde

| Carpeta | Responsabilidad | NO va acá |
|---|---|---|
| `api/` | Funciones que llaman al backend vía axios | Lógica de UI, hooks, estado |
| `components/` | JSX presentacional, recibe props | Fetch, hooks de React Query, zustand |
| `containers/` | Orquestación: fetch, state, loading/error | Reusarse cross-feature |
| `hooks/` | Hooks específicos del feature (queries, mutations) | Componentes |
| `stores/` | Zustand stores con UI state compartido | Server state (eso es TanStack Query) |
| `types/` | Solo `type` e `interface` | Lógica |
| `validation/` | Zod schemas | UI |
| `pages/` | Componentes que mapean 1:1 a rutas | Lógica reutilizable |
| `shared/ui/` | Componentes presentacionales reusables | Fetch, store, hooks del feature |
| `lib/` | Utilidades que no son UI (api-client, query-client) | Componentes |

### 3.2 Bulletproof check

```bash
# Ningún presentacional debe importar hooks de fetch
rg "useQuery|useMutation|useSuspenseQuery" src/features/*/components/
# Esperado: 0 resultados

# Ningún presentacional debe importar zustand stores
rg "use[A-Z]\w*Store" src/features/*/components/
# Esperado: 0 resultados (excepto casos justificados)

# Cada feature debe tener su api/ si consume backend
rg "import.*from.*api" src/features/
# Esperado: al menos un match por feature con backend
```

---

## 4. Container vs Presentacional

El patrón divide los componentes en dos roles complementarios:

| Container (inteligente) | Presentacional (tonto) |
|---|---|
| Hace fetch con TanStack Query | Recibe todo por props |
| Lee de zustand stores | No conoce stores |
| Maneja loading/error | No conoce loading/error |
| Orquesta sub-componentes | Renderiza JSX puro |
| Vive en `containers/` o `pages/` | Vive en `components/` o `shared/ui/` |
| Testeable con mocks de fetch | Testeable solo con `render(<X props={...} />)` |

### 4.1 Ejemplo correcto

```tsx
// features/admin/containers/VehicleListContainer.tsx — container
import { useVehicles } from '../hooks/useVehicles'
import { VehicleTable } from '../components/VehicleTable'
import { PageHeader, LoadingSpinner, ErrorMessage } from '@shared/ui'

export function VehicleListContainer() {
  const { data: vehicles, isLoading, isError } = useVehicles()
  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorMessage>Error al cargar los vehículos.</ErrorMessage>
  return (
    <>
      <PageHeader title="Vehículos" subtitle="Administración · Vehículos" />
      <VehicleTable vehicles={vehicles ?? []} />
    </>
  )
}
```

```tsx
// features/admin/components/VehicleTable.tsx — presentacional
import type { Vehicle } from '../types/vehicle'
import { Card, CardHeader, CardBody, StatusBadge, EmptyState } from '@shared/ui'

export function VehicleTable({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <Card>
      <CardHeader><h2>Vehículos</h2></CardHeader>
      <CardBody>
        <table>...</table>
        {vehicles.length === 0 && <EmptyState>No hay vehículos registrados.</EmptyState>}
      </CardBody>
    </Card>
  )
}
```

### 4.2 Ejemplo incorrecto (lo que NO se hace)

```tsx
// ❌ Mezclando container y presentacional
export default function VehicleTable() {
  const { data: vehicles, isLoading, error } = useVehicles()  // container
  
  if (isLoading) return <p>Cargando...</p>                     // container
  if (error) return <p>Error</p>                              // container
  
  return (                                                      // presentacional
    <table>...</table>
  )
}
```

### 4.3 Regla de los nombres

- `Page`, `Container`, `View` → probablemente container
- `Table`, `Form`, `Card`, `Badge`, `Button`, `Field` → probablemente presentacional

### 4.4 Bulletproof check

```bash
# Ningún archivo de components/ debe importar de api/ o hooks/
rg "from.*['\"]\.\./(api|hooks)/" src/features/*/components/
# Esperado: 0 resultados (excepto types/)

# Containers pueden importar de components/ y de api/, hooks/
rg "from.*['\"]\.\./components/" src/features/*/containers/
# Esperado: sí hay matches
```

---

## 5. Styling con Tailwind v4

### 5.1 Tokens en `@theme`

Toda la paleta, sombras y animaciones se definen en `src/index.css` con `@theme`. **Nunca** se usan hex literales en `className`.

```css
@theme {
  --color-surface-app: #0b0e14;
  --color-surface-panel: #111827;
  --color-surface-card: #161b22;
  --color-surface-row-hover: #1f2937;
  --color-border-subtle: #1f2937;
  --color-border-default: #374151;
  --color-brand-50: #ecfdf5;
  --color-brand-400: #34d399;
  --color-brand-500: #10b185;
  --color-brand-600: #059669;
  --color-brand-glow: rgba(16, 185, 129, 0.15);
  --color-state-available: var(--color-brand-500);
  --color-state-occupied: #eab308;
  --color-state-unavailable: #6b7280;
  --color-state-error: #ef4444;
  --color-state-warn: #eab308;
  --shadow-brand-glow: 0 0 15px var(--color-brand-glow);
}
```

### 5.2 Familias de tokens disponibles

| Familia | Uso | Ejemplos |
|---|---|---|
| `surface-*` | Fondos por elevación | `bg-surface-app`, `bg-surface-card` |
| `border-*` | Bordes semánticos | `border-border-subtle` |
| `brand-*` | Color de marca (verde único) | `bg-brand-500`, `text-brand-400` |
| `state-*` | Estados del dominio | `bg-state-available`, `text-state-error` |

**Convención**: no usar `emerald-*`, `teal-*`, `green-*` ni nombres de color de Tailwind para el verde de marca. Todo verde va por `brand-*`. Esto unifica el sistema.

### 5.3 Animaciones custom

`animate-fade-in` y `custom-scrollbar` se definen en `index.css` (no son parte de Tailwind). Si necesitás una animación nueva, agregala al mismo archivo.

### 5.4 Regla de aceptación

```bash
# Estos comandos deben devolver 0 resultados
rg "bg-\[#" src/
rg "text-\[#" src/
rg "border-\[#" src/
rg "shadow-\[" src/
```

### 5.5 Excepciones permitidas

- Opacidades con la sintaxis `bg-brand-500/30` (Tailwind nativo, no hex literal)
- Gradientes con `from-*` / `to-*` usando solo tokens de `@theme`

---

## 6. Componentes reusables (`shared/ui/`)

### 6.1 Lista de componentes disponibles

| Componente | Props principales | Cuándo usarlo |
|---|---|---|
| `<Card>`, `<CardHeader>`, `<CardBody>`, `<CardFooter>` | `children`, `className?` | Cualquier container visual (tabla, modal, panel) |
| `<FormLabel>` | `htmlFor`, `children`, `required?` | Etiqueta de campo de form |
| `<TextInput>` | `error?`, `...inputProps` | Input de texto con label implícito |
| `<Select>` | `error?`, `...selectProps` | Dropdown con label implícito |
| `<FieldHint>` | `children` | Texto de ayuda bajo un campo |
| `<FieldError>` | `message` | Mensaje de error de validación |
| `<StatusBadge>` | `variant`, `children` | Badge de estado (available, occupied, parked, etc.) |
| `<Icon>` | `name`, `className?` | Cualquier icono (nombres: `close`, `check`, `plus`, `chevron-right`, `document`, `arrows`, `grid`, `alert`) |
| `<NavLinkItem>` | `to`, `icon`, `label`, `badge?`, `isActive?` | Link del sidebar/nav |
| `<PageHeader>` | `title`, `subtitle` | Cabecera de página |
| `<SectionTitle>` | `children` | Subtítulo de sección |
| `<LoadingSpinner>` | — | Estado de carga |
| `<ErrorMessage>` | `children` | Estado de error |
| `<EmptyState>` | `children` | Estado vacío (sin datos) |

### 6.2 Regla de oro

Si un componente necesita `useQuery`, `useMutation`, `useAuth`, o leer un store, **no va en `shared/ui/`**. Va en `features/<feature>/components/` o `features/<feature>/containers/`.

### 6.3 Bulletproof check

```bash
# Ningún componente de shared/ui/ debe importar hooks de fetch ni stores
rg "useQuery|useMutation|use[A-Z]\w*Store" src/shared/ui/
# Esperado: 0 resultados
```

---

## 7. Manejo de estado

### 7.1 Regla del "2+"

| Tipo de estado | Herramienta | Cuándo |
|---|---|---|
| **Server state** (datos del backend) | **TanStack Query** (`useQuery`, `useMutation`) | Siempre que hay endpoint |
| **Form state** | **react-hook-form** + zod | Inputs de formulario |
| **UI state global compartido** | **Zustand** | Leído por 2+ componentes, sobrevive a navegación |
| **UI state local trivial** | `useState` | Un solo componente, no se comparte (hover, focus) |
| **Tema / i18n** | Context API o Zustand | Cross-cutting global |

### 7.2 Zustand — reglas

```ts
// ✅ Selectores estrechos
const isOpen = useAdminUIStore((s) => s.isSidebarOpen)
const toggle = useAdminUIStore((s) => s.toggleSidebar)

// ❌ Suscripción al store completo
const store = useAdminUIStore()  // re-render en cualquier cambio
```

- **Ubicación**: `features/<feature>/stores/<name>-store.ts`
- **Un store por feature** (no `src/stores/` global salvo auth/tema)
- **Nunca mezclar server state** con Zustand (server state va en TanStack Query)
- **Consumir siempre en containers**, no en presentacionales

### 7.3 TanStack Query — reglas

- Las queries se definen en `features/<feature>/hooks/`
- El hook se nombra `use<Entity>` (ej: `useVehicles`, `useSpots`)
- Las mutations invalidan las queries relacionadas en `onSuccess`
- El `queryClient` vive en `src/lib/query-client.ts`

### 7.4 Bulletproof check

```bash
# Server state no debe estar en zustand
rg "useQuery|useMutation" src/features/*/stores/
# Esperado: 0 resultados

# Zustand no debe estar en shared/ui/
rg "use[A-Z]\w*Store" src/shared/ui/
# Esperado: 0 resultados
```

---

## 8. Variantes de componentes

5 estrategias, en orden de preferencia según el caso:

| # | Estrategia | Cuándo | Dependencia |
|---|---|---|---|
| 1 | Props tipadas (`variant?: 'a' \| 'b' \| 'c'`) | Variants finitas y estables | Ninguna |
| 2 | `cva` (class-variance-authority) | 2+ ejes de variación (variant × size × state) | `class-variance-authority` |
| 3 | Slots (`Card.Header`, `Card.Body`) | Estructura flexible que el caller compone | Ninguna |
| 4 | `className` override con `tailwind-merge` | Escape hatch para el 1% de casos raros | `tailwind-merge` |
| 5 | Zustand | **NO** para variants, sí para estado global | `zustand` |

### 8.1 Ejemplo con cva

```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonStyles = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-colors disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:   'bg-brand-500 text-black hover:bg-brand-400',
        secondary: 'bg-surface-panel text-white hover:bg-surface-row-hover',
        ghost:     'bg-transparent text-gray-300 hover:bg-surface-panel',
        danger:    'bg-state-error/10 text-state-error border border-state-error/30',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)
```

### 8.2 Ejemplo con className override

```tsx
import { twMerge } from 'tailwind-merge'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={twMerge('bg-surface-card rounded-xl shadow-xl border border-border-subtle', className)}>
      {children}
    </div>
  )
}

// El caller puede sobreescribir clases sin conflictos
<Card className="border-brand-500/30">Especial</Card>
```

### 8.3 Regla

- **No crear variants especulativas**. Si una variant la usa un solo caso, hacer override con `className`.
- **El `className` override no admite hex literales**. La política de cero hex en `src/` sigue activa.
- **Documentar las variants** con un comentario al inicio del archivo.

---

## 9. Convenciones de código

### 9.1 Naming

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | `PascalCase` | `VehicleTable`, `AdminLayout` |
| Hooks | `camelCase` con `use` | `useVehicles`, `useAdminUIStore` |
| Stores (Zustand) | `camelCase` con `use` + `Store` | `useAdminUIStore` |
| Tipos | `PascalCase` | `Vehicle`, `Spot`, `CreateVehicleInput` |
| Archivos de componentes | `PascalCase.tsx` | `VehicleTable.tsx` |
| Archivos de hooks | `camelCase.ts` | `useVehicles.ts` |
| Archivos de stores | `camelCase-store.ts` | `adminUIStore.ts` |
| Archivos de tipos | `camelCase.ts` o `kebab-case.ts` | `vehicle.ts` |
| Constantes | `UPPER_SNAKE_CASE` | `MAX_VEHICLES = 400` |
| Magic numbers | Constantes en `constants.ts` | `DEFAULT_TOTAL_SPOTS` |

### 9.2 Exports

- **Named exports** para todo, excepto el `default` para componentes que son punto de entrada de ruta
- Cada feature tiene un `index.ts` que re-exporta su API pública
- `shared/ui/` tiene un `index.ts` (barrel) con todos los componentes

### 9.3 Imports

- Aliases (definidos en `tsconfig.app.json`):
  - `@/*` → `./src/*`
  - `@app/*` → `./src/app/*`
  - `@features/*` → `./src/features/*`
  - `@lib/*` → `./src/lib/*`
  - `@shared/*` → `./src/shared/*`
  - `@testing/*` → `./src/testing/*`
- **No usar paths relativos** que pasen por encima del directorio del feature (`../../../shared/`). Usar siempre los aliases.

### 9.4 Strings de UI

- **Todos los strings de UI van en `labels.ts`** del feature correspondiente
- Estructura: `export const adminLabels = { vehicles: { title: 'Vehículos', ... } }`
- **No hardcodear strings** en JSX

### 9.5 Magic numbers

- **Van en `constants.ts`** del feature
- Ejemplo: `DEFAULT_TOTAL_SPOTS = 120`, `MAX_VEHICLES_BADGE = 400`

### 9.6 Bulletproof check

```bash
# Strings hardcoded comunes (palabras típicas de UI)
rg ">[A-Z][a-záéíóúñ ]+</" src/features/*/components/
# Revisión manual: lo que aparezca debe ser una excepción justificada

# Magic numbers en componentes
rg "= [0-9]{2,}" src/features/*/components/
# Revisión manual: debe haber sido movido a constants.ts
```

---

## 10. Tests

### 10.1 Qué testear

| Tipo | Qué testear | Cómo |
|---|---|---|
| **Unit de presentacionales** | Renderiza con props, no rompe con edge cases | `render(<X prop={mockValue} />)` |
| **Unit de hooks** | Devuelve data correcta, maneja loading/error | `renderHook` + msw server |
| **Unit de stores** | Acciones actualizan el estado esperado | `useStore.setState()` + `getState()` |
| **Unit de utils** | Funciones puras, edge cases | Llamada directa |
| **Integración** | Container con sus componentes hijos | `render` con providers mock |

### 10.2 Qué NO testear

- Implementación interna (cómo se renderiza, qué hooks se llaman)
- Snapshots visuales (cambian con cada refactor de estilo)
- Componentes que son solo re-exports de `shared/ui/`

### 10.3 Ubicación

- Tests unitarios: junto al archivo (`Component.test.tsx`)
- Tests de integración: `src/features/<feature>/__tests__/`
- Setup global: `src/test/setup.ts`
- Handlers de msw: `src/testing/mocks/handlers/`

---

## 11. Anti-patrones (lo que NO se hace)

| Anti-patrón | Por qué | Qué hacer en su lugar |
|---|---|---|
| Hex literal en `className` (`bg-[#0b0e14]`) | Rompe el design system, hay que buscar en N lugares para cambiar | Token en `@theme` |
| `useState` para estado que lee otro componente | Prop drilling o estado desincronizado | Zustand store |
| Componente "Table" con `useQuery` adentro | Acopla tabla a la query, no se reusa | Container separado + presentacional |
| SVGs inline copiados a mano | Si cambian los iconos, hay que cazarlos todos | `<Icon name="..." />` |
| Strings en español hardcoded en JSX | i18n es imposible después | `labels.ts` |
| Magic numbers en JSX | Incomprensibles sin contexto | `constants.ts` |
| `useEffect` para sincronizar estado | Race conditions, complejidad | Zustand o `useMemo` |
| `any` en TypeScript | Pierde el propósito del tipado | `unknown` + narrowing |
| Fetch directo en componente con `axios` | Re-fetch manual, sin cache | Hook de TanStack Query |
| `localStorage` con `useEffect` | Frágil, race conditions | Zustand con middleware `persist` |
| Componente > 200 líneas | Hace demasiadas cosas | Dividir en sub-piezas |
| Carpetas `utils/`, `helpers/`, `misc/` | Cebo de archivos sin dueño | Cada archivo a su feature |
| `console.log` en commits | Ruido, leak de info | Eliminar antes del commit |

---

## 12. Validación automática

Comandos que CI debería correr en cada PR. Si alguno falla, el PR no se mergea.

```bash
# ── 1. Cero inlines de estilo ──
rg "bg-\[#" src/          # 0 resultados
rg "text-\[#" src/        # 0 resultados
rg "border-\[#" src/      # 0 resultados
rg "shadow-\[" src/       # 0 resultados

# ── 2. Separación container/presentacional ──
rg "useQuery|useMutation|useSuspenseQuery" src/features/*/components/  # 0
rg "use[A-Z]\w*Store" src/features/*/components/  # 0
rg "from.*['\"]\.\./(api|hooks)/" src/features/*/components/  # 0

# ── 3. shared/ui/ limpio ──
rg "useQuery|useMutation|use[A-Z]\w*Store" src/shared/ui/  # 0

# ── 4. Server state no en zustand ──
rg "useQuery|useMutation" src/features/*/stores/  # 0

# ── 5. Tamaño de archivos ──
# Ningún .tsx en components/ debe pasar de 200 líneas
find src/features/*/components -name "*.tsx" -exec wc -l {} \; | awk '$1 > 200 { print }'  # 0

# ── 6. Build, lint, tests ──
npm run lint       # 0 errores
npm run test:run   # todos pasan
npm run build      # éxito
```

---

## 13. Antes de pedir review

Checklist personal antes de abrir PR:

- [ ] `rg "bg-\[#" src/` → 0
- [ ] `rg "useQuery" src/features/*/components/` → 0
- [ ] Ningún archivo `.tsx` en `components/` pasa de 200 líneas
- [ ] No agregué dependencias sin discutirlo
- [ ] Los strings de UI nuevos están en `labels.ts`
- [ ] Los magic numbers nuevos están en `constants.ts`
- [ ] Si agregué un componente a `shared/ui/`, es presentacional puro
- [ ] Si agregué un store, está en `features/<feature>/stores/`
- [ ] `npm run lint` pasa
- [ ] `npm run test:run` pasa
- [ ] `npm run build` pasa
- [ ] El diff visual vs la rama base no tiene cambios accidentales

---

## 14. Recursos

### Documentación del proyecto

- Este guideline (`docs/GUIDELINE.md`)
- Notas del vault de Obsidian: `C:\Users\jhony\Desktop\Dev Secrets\03 - Proyectos\tartis\Frontend\`

### Documentación externa

- [React](https://react.dev/)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind v4](https://tailwindcss.com/docs)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [react-hook-form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/)

---

**Versión del guideline**: 1.0
**Última actualización**: 2026-07-22
**Mantenedor**: tech lead frontend
