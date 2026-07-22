import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router'
import VehicleTable from '@/features/admin/components/VehicleTable'
import VehicleCreatePage from '@/features/admin/pages/VehicleCreatePage'
import AdminHomePage from '@/features/admin/pages/AdminHomePage'

import { SpotListPage, TariffListPage } from '@/features/admin'
import { AdminLayout } from '@/features/admin/components/AdminLayout'

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
  component: AdminLayout,
})

const vehiclesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/vehicles',
  component: () => (
    <>
      <VehicleTable />
      <Outlet />
    </>
  ),
})

const vehicleNewRoute = createRoute({
  getParentRoute: () => vehiclesRoute,
  path: '/new',
  component: VehicleCreatePage,
})

const spotsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/spots',
  component: SpotListPage,
})

const tariffsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/tariffs',
  component: TariffListPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute.addChildren([
    vehiclesRoute.addChildren([vehicleNewRoute]),
    spotsRoute,
    tariffsRoute,
  ]),
])

export const router = createRouter({ routeTree })
