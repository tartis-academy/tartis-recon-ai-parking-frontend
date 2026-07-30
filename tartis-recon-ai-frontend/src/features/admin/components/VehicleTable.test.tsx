import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VehicleTable } from './VehicleTable'
import type { Vehicle } from '../types/vehicle'
import { adminLabels } from '../labels'

const mockVehicles: Vehicle[] = [
  { uniqueId: '1', plate: '1234ABC', brand: 'Toyota', model: 'Corolla', color: 'Blanco', type: 'CAR', numDoors: 5, hasSidecar: false, active: true, isParked: true },
  { uniqueId: '2', plate: '5678DEF', brand: 'Seat', model: 'Ibiza', color: 'Rojo', type: 'CAR_PMR', numDoors: 3, hasSidecar: false, active: false, isParked: false },
  { uniqueId: '3', plate: '9012GHI', brand: 'Honda', model: 'CBR', color: 'Negro', type: 'MOTORBIKE', numDoors: 0, hasSidecar: false, active: true, isParked: false },
]

describe('VehicleTable Component', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    statusFilter: 'ALL' as const,
    onFilterChange: vi.fn(),
    onToggleStatus: vi.fn(),
  }

  it('renders correctly with vehicles', () => {
    render(<VehicleTable vehicles={mockVehicles} {...defaultProps} />)

    // Check headers and summary
    expect(screen.getByText(adminLabels.vehicles.pageTitle)).toBeInTheDocument()
    expect(screen.getByText(`3 ${adminLabels.vehicles.records}`)).toBeInTheDocument()

    // Check rows rendering
    expect(screen.getByText('VHC-1')).toBeInTheDocument()
    expect(screen.getByText('1234ABC')).toBeInTheDocument()
    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument()
    expect(screen.getByText(adminLabels.vehicles.types.car)).toBeInTheDocument()
    
    expect(screen.getByText('VHC-2')).toBeInTheDocument()
    expect(screen.getByText('5678DEF')).toBeInTheDocument()
    expect(screen.getByText(adminLabels.vehicles.types.carPmr)).toBeInTheDocument()

    expect(screen.getByText('VHC-3')).toBeInTheDocument()
    expect(screen.getByText('9012GHI')).toBeInTheDocument()
    expect(screen.getByText(adminLabels.vehicles.types.motorbike)).toBeInTheDocument()
  })

  it('renders empty state when there are no vehicles', () => {
    render(<VehicleTable vehicles={[]} {...defaultProps} />)
    expect(screen.getByText(adminLabels.vehicles.emptyState)).toBeInTheDocument()
  })

  it('handles search input change', () => {
    const onSearchChange = vi.fn()
    render(<VehicleTable vehicles={mockVehicles} {...defaultProps} onSearchChange={onSearchChange} />)
    
    const searchInput = screen.getByPlaceholderText(adminLabels.vehicles.searchPlaceholder)
    fireEvent.change(searchInput, { target: { value: '123' } })
    expect(onSearchChange).toHaveBeenCalledWith('123')
  })

  it('handles status filter change', () => {
    const onFilterChange = vi.fn()
    render(<VehicleTable vehicles={mockVehicles} {...defaultProps} onFilterChange={onFilterChange} />)
    
    const filterSelect = screen.getByRole('combobox')
    fireEvent.change(filterSelect, { target: { value: 'PARKED' } })
    expect(onFilterChange).toHaveBeenCalledWith('PARKED')
  })

  it('shows inactive badge for inactive vehicles', () => {
    render(<VehicleTable vehicles={mockVehicles} {...defaultProps} />)
    
    // Vehicle 2 is inactive
    expect(screen.getByText(adminLabels.vehicles.actions.inactive)).toBeInTheDocument()
  })

  it('allows clicking toggle status button for non-parked vehicles', () => {
    const onToggleStatus = vi.fn()
    render(<VehicleTable vehicles={mockVehicles} {...defaultProps} onToggleStatus={onToggleStatus} />)

    // Vehicle 1 is parked, toggle status button should not render.
    // Vehicle 2 is inactive, button is ALTA.
    // Vehicle 3 is active, button is BAJA.
    const activateButton = screen.getByTitle(adminLabels.vehicles.actions.activate)
    const deactivateButton = screen.getByTitle(adminLabels.vehicles.actions.deactivate)

    expect(activateButton).toBeInTheDocument()
    expect(deactivateButton).toBeInTheDocument()
    expect(screen.getByText('ALTA')).toBeInTheDocument()
    expect(screen.getAllByText('BAJA').length).toBeGreaterThan(0)

    fireEvent.click(activateButton)
    expect(onToggleStatus).toHaveBeenCalledWith(mockVehicles[1])

    fireEvent.click(deactivateButton)
    expect(onToggleStatus).toHaveBeenCalledWith(mockVehicles[2])
  })

  it('renders EDITAR button and calls onEdit when clicked', () => {
    const onEdit = vi.fn()
    render(<VehicleTable vehicles={mockVehicles} {...defaultProps} onEdit={onEdit} />)

    const editButtons = screen.getAllByTitle(adminLabels.vehicles.actions.edit)
    expect(editButtons).toHaveLength(3)
    expect(screen.getAllByText('EDITAR')).toHaveLength(3)

    fireEvent.click(editButtons[0])
    expect(onEdit).toHaveBeenCalledWith(mockVehicles[0])
  })
})
