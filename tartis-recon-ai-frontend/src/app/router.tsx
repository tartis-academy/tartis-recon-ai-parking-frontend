import { lazy } from 'react'
import {
  createRouter,
  createRootRoute,
  createRoute,
  Link,
} from '@tanstack/react-router'
import { ShellLayout } from './layouts/ShellLayout'
import { RemoteSlot } from './components/RemoteSlot'
import { shellLabels } from './labels'

// eslint-disable-next-line react-refresh/only-export-components -- lazy-loaded federated remotes, consumed as components in route definitions
const EntryExitApp = lazy(() => import('mfe_entryexit/EntryExitApp'))
// eslint-disable-next-line react-refresh/only-export-components
const AdminApp = lazy(() => import('mfe_admin/AdminApp'))

const rootRoute = createRootRoute({
  component: ShellLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function HomePage() {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {shellLabels.homeTitle}
          </h2>
          <p className="mt-1 text-gray-400">{shellLabels.homeDescription}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            to="/entry-exit"
            className="group rounded-xl border border-border-subtle bg-surface-card p-6 transition-all duration-300 hover:border-brand-500/50 hover:shadow-brand-glow"
          >
            <span className="mb-3 block text-3xl" aria-hidden="true">🚗</span>
            <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-brand-400">
              {shellLabels.navEntryExit}
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {shellLabels.entryExitDescription}
            </p>
          </Link>

          <Link
            to="/admin"
            className="group rounded-xl border border-border-subtle bg-surface-card p-6 transition-all duration-300 hover:border-brand-500/50 hover:shadow-brand-glow"
          >
            <span className="mb-3 block text-3xl" aria-hidden="true">⚙️</span>
            <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-brand-400">
              {shellLabels.navAdmin}
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {shellLabels.adminDescription}
            </p>
          </Link>
        </div>
      </div>
    )
  },
})

const entryExitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entry-exit',
  component: function EntryExitPage() {
    return (
      <RemoteSlot moduleName={shellLabels.navEntryExit}>
        <EntryExitApp />
      </RemoteSlot>
    )
  },
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: function AdminPage() {
    return (
      <RemoteSlot moduleName={shellLabels.navAdmin}>
        <AdminApp />
      </RemoteSlot>
    )
  },
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  entryExitRoute,
  adminRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
