import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router'
import AdminHomePage from '@/features/admin/pages/AdminHomePage'

import { AdminLayoutContainer } from '@/features/admin/containers/AdminLayoutContainer'
import { VehicleListContainer } from '@/features/admin/containers/VehicleListContainer'
import { SpotListContainer } from '@/features/admin/containers/SpotListContainer'
import { StayListContainer } from '@/features/admin/containers/StayListContainer'
import { VehicleFormContainer } from '@/features/admin/containers/VehicleFormContainer'
import { TariffListPage } from '@/features/admin'

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
  component: AdminLayoutContainer,
})

const vehiclesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/vehicles',
  component: () => (
    <>
      <VehicleListContainer />
      <Outlet />
    </>
  ),
})

const vehicleNewRoute = createRoute({
  getParentRoute: () => vehiclesRoute,
  path: '/new',
  component: VehicleFormContainer,
})

const spotsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/spots',
  component: SpotListContainer,
})

const tariffsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/tariffs',
  component: TariffListPage,
})

const staysRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/stays',
  component: StayListContainer,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute.addChildren([
    vehiclesRoute.addChildren([vehicleNewRoute]),
    spotsRoute,
    tariffsRoute,
    staysRoute,
  ]),
])

export const router = createRouter({ routeTree })
