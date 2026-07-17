import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import VehicleTable from '@/features/admin/components/VehicleTable'

import { SpotListPage } from '@/features/admin'

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

const spotsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/spots',
  component: SpotListPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  //vehiclesRoute.addChildren([vehicleNewRoute]),
  vehiclesRoute,
  spotsRoute,
])

export const router = createRouter({ routeTree })
