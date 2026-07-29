import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SpotMaintenanceModal } from './SpotMaintenanceModal'
import { adminLabels } from '../labels'
import type { Spot } from '../types/spot'

const mockSpot: Spot = {
  id: 'A-01',
  type: 'CAR',
  status: 'AVAILABLE',
}

const mockUnavailableSpot: Spot = {
  ...mockSpot,
  status: 'UNAVAILABLE',
}

describe('SpotMaintenanceModal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <SpotMaintenanceModal
        isOpen={false}
        spot={mockSpot}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isPending={false}
      />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders correctly for available spot (put into maintenance)', () => {
    render(
      <SpotMaintenanceModal
        isOpen={true}
        spot={mockSpot}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isPending={false}
      />,
    )
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(adminLabels.spots.maintenance.confirmTitle)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.spots.maintenance.confirmMessage)).toBeInTheDocument()
    expect(screen.getByText(mockSpot.id)).toBeInTheDocument()
  })

  it('renders correctly for unavailable spot (restore)', () => {
    render(
      <SpotMaintenanceModal
        isOpen={true}
        spot={mockUnavailableSpot}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isPending={false}
      />,
    )
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(adminLabels.spots.maintenance.restoreTitle)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.spots.maintenance.restoreMessage)).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(
      <SpotMaintenanceModal
        isOpen={true}
        spot={mockSpot}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
        isPending={false}
      />,
    )
    
    await user.click(screen.getByRole('button', { name: adminLabels.spots.maintenance.confirm }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(
      <SpotMaintenanceModal
        isOpen={true}
        spot={mockSpot}
        onConfirm={vi.fn()}
        onCancel={onCancel}
        isPending={false}
      />,
    )
    
    await user.click(screen.getByRole('button', { name: adminLabels.spots.maintenance.cancel }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Escape key is pressed', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(
      <SpotMaintenanceModal
        isOpen={true}
        spot={mockSpot}
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
      <SpotMaintenanceModal
        isOpen={true}
        spot={mockSpot}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isPending={true}
      />,
    )
    
    expect(screen.getByRole('button', { name: adminLabels.spots.maintenance.cancel })).toBeDisabled()
    expect(screen.getByRole('button', { name: adminLabels.spots.maintenance.processing })).toBeDisabled()
  })
})
