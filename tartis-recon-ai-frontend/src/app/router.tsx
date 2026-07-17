import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import VehicleTable from '@/features/admin/components/VehicleTable'

const rootRoute = createRootRoute({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/vehicles' })
  },
  component: () => null,
})

const vehiclesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vehicles',
  component: () => (
    <div>
      <h1>Vehículos</h1>
      <VehicleTable />
    </div>
  ),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  vehiclesRoute,
])

export const router = createRouter({ routeTree })
