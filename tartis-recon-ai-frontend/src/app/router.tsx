import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router'
import { useToastStore } from './stores/toast-store'

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-surface-app text-white font-sans antialiased">
      <Outlet />
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function IndexPage() {
    const addToast = useToastStore((s) => s.addToast)

    const handleTestNotification = () => {
      addToast({
        title: 'Prueba de Notificación',
        message: 'Evento SSE simulado correctamente.',
        type: 'success',
      })
    }

    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            TARTIS Recon-AI Shell Host
          </h1>
          <p className="text-gray-400 text-base">
            Aplicación raíz/shell lista para la composición de módulos remotos y notificaciones SSE en tiempo real.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-surface-card border border-border-subtle shadow-xl space-y-4">
          <h2 className="text-lg font-semibold text-white">Estado de Notificaciones SSE</h2>
          <p className="text-xs text-gray-300">
            Escuchando eventos en tiempo real desde <code className="text-brand-400 font-mono">/v1/events</code>.
          </p>
          <button
            type="button"
            onClick={handleTestNotification}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-500 text-black hover:bg-brand-400 transition-colors shadow-md cursor-pointer"
          >
            Simular Notificación Toast
          </button>
        </div>
      </div>
    )
  },
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
