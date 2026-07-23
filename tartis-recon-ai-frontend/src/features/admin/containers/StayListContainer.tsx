import { useState } from 'react'
import { useStays } from '../hooks/useStays'
import { StayTable } from '../components/StayTable'
import { PageHeader, LoadingSpinner, ErrorMessage } from '@/shared/ui'
import { adminLabels } from '../labels'
import { DEFAULT_PAGE_SIZE } from '../constants'
import type { StayStatusFilter, StayVehicleTypeFilter } from '../types/stay'

export function StayListContainer() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StayStatusFilter>('ALL')
  const [vehicleType, setVehicleType] = useState<StayVehicleTypeFilter>('ALL')

  const filters = {
    search: search || undefined,
    status: status === 'ALL' ? undefined : status,
    vehicleType: vehicleType === 'ALL' ? undefined : vehicleType,
  }

  const { data, isLoading, isError } = useStays(page, pageSize, filters)

  if (isLoading && !data) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ErrorMessage>{adminLabels.stays.error}</ErrorMessage>
  }

  const handlePaginationChange = (params: { page: number; pageSize: number }) => {
    setPage(params.page)
    setPageSize(params.pageSize)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleStatusChange = (value: StayStatusFilter) => {
    setStatus(value)
    setPage(1)
  }

  const handleVehicleTypeChange = (value: StayVehicleTypeFilter) => {
    setVehicleType(value)
    setPage(1)
  }

  const handleClearFilters = () => {
    setSearch('')
    setStatus('ALL')
    setVehicleType('ALL')
    setPage(1)
  }

  return (
    <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto animate-fade-in">
      <PageHeader
        title={adminLabels.stays.pageTitle}
        subtitle={adminLabels.stays.pageSubtitle}
      />
      <StayTable
        stays={data?.data ?? []}
        total={data?.total ?? 0}
        page={data?.page ?? page}
        pageSize={data?.pageSize ?? pageSize}
        search={search}
        status={status}
        vehicleType={vehicleType}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onVehicleTypeChange={handleVehicleTypeChange}
        onPaginationChange={handlePaginationChange}
        onClearFilters={handleClearFilters}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}
