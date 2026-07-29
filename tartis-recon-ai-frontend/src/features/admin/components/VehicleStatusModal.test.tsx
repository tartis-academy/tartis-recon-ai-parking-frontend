import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { VehicleStatusModal } from './VehicleStatusModal'
import { adminLabels } from '../labels'
import type { Vehicle } from '../types/vehicle'

const mockActiveVehicle: Vehicle = {
  id: 'v1',
  uniqueId: '1234',
  plate: '1234ABC',
  brand: 'Seat',
  model: 'León',
  color: 'Blanco',
  type: 'CAR',
  isParked: false,
  active: true,
}

const mockInactiveVehicle: Vehicle = {
  ...mockActiveVehicle,
  active: false,
}

describe('VehicleStatusModal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <VehicleStatusModal
        isOpen={false}
        vehicle={mockActiveVehicle}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isPending={false}
      />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders correctly for active vehicle (deactivate)', () => {
    render(
      <VehicleStatusModal
        isOpen={true}
        vehicle={mockActiveVehicle}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isPending={false}
      />,
    )
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(adminLabels.vehicles.actions.confirmDeactivateTitle)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.vehicles.actions.confirmDeactivateMessage)).toBeInTheDocument()
    expect(screen.getByText(mockActiveVehicle.plate)).toBeInTheDocument()
  })

  it('renders correctly for inactive vehicle (activate)', () => {
    render(
      <VehicleStatusModal
        isOpen={true}
        vehicle={mockInactiveVehicle}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isPending={false}
      />,
    )
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(adminLabels.vehicles.actions.confirmActivateTitle)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.vehicles.actions.confirmActivateMessage)).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(
      <VehicleStatusModal
        isOpen={true}
        vehicle={mockActiveVehicle}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
        isPending={false}
      />,
    )
    
    await user.click(screen.getByRole('button', { name: adminLabels.vehicles.actions.confirm }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(
      <VehicleStatusModal
        isOpen={true}
        vehicle={mockActiveVehicle}
        onConfirm={vi.fn()}
        onCancel={onCancel}
        isPending={false}
      />,
    )
    
    await user.click(screen.getByRole('button', { name: adminLabels.vehicles.actions.cancel }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Escape key is pressed', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(
      <VehicleStatusModal
        isOpen={true}
        vehicle={mockActiveVehicle}
        onConfirm={vi.fn()}
        onCancel={onCancel}
        isPending={false}
      />,
    )
    
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('disables buttons and shows processing text when isPending is true', () => {
    render(
      <VehicleStatusModal
        isOpen={true}
        vehicle={mockActiveVehicle}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isPending={true}
      />,
    )
    
    expect(screen.getByRole('button', { name: adminLabels.vehicles.actions.cancel })).toBeDisabled()
    expect(screen.getByRole('button', { name: adminLabels.vehicles.actions.processing })).toBeDisabled()
  })
})
