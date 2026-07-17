import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router'

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
  component: () => <h1>Vehicles List</h1>,
})

const vehicleNewRoute = createRoute({
  getParentRoute: () => vehiclesRoute,
  path: '/new',
  component: () => <h1>New Vehicle</h1>,
})

const spotsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/spots',
  component: SpotListPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  vehiclesRoute.addChildren([vehicleNewRoute]),
  spotsRoute,
])

export const router = createRouter({ routeTree })
