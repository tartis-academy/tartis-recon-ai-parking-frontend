import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router'
import VehicleTable from '@/features/admin/components/VehicleTable'
import VehicleCreatePage from '@/features/admin/pages/VehicleCreatePage'
import AdminHomePage from '@/features/admin/pages/AdminHomePage'

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
  component: AdminHomePage,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => <Outlet />,
})

const vehiclesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/vehicles',
  component: () => <VehicleTable />,
})

const vehicleNewRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/vehicles/new',
  component: VehicleCreatePage,
})

const spotsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/spots',
  component: SpotListPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute.addChildren([
    vehiclesRoute,
    vehicleNewRoute,
    spotsRoute,
  ]),
])

export const router = createRouter({ routeTree })
