import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router'

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Outlet />
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
        TARTIS Recon-AI Shell Host
      </h1>
      <p className="text-slate-600 text-base">
        Aplicación raíz/shell lista para la composición de módulos remotos de microfrontends.
      </p>
    </div>
  ),
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
