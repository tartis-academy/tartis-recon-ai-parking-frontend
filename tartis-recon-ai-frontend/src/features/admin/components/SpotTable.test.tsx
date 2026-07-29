import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SpotTable } from './SpotTable'
import type { Spot } from '../types/spot'
import { adminLabels } from '../labels'

const mockSpots: Spot[] = [
  { id: '1', type: 'CAR', status: 'AVAILABLE' },
  { id: '2', type: 'CAR_PMR', status: 'OCCUPIED' },
  { id: '3', type: 'MOTORBIKE', status: 'UNAVAILABLE' },
]

describe('SpotTable Component', () => {
  it('renders correctly with spots', () => {
    const handleToggle = vi.fn()
    render(<SpotTable spots={mockSpots} onToggleMaintenance={handleToggle} />)

    // Check headers
    expect(screen.getByText(adminLabels.spots.pageTitle)).toBeInTheDocument()
    expect(screen.getByText('3 registros')).toBeInTheDocument()

    // Check rows and types rendering
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText(adminLabels.spots.types.standard)).toBeInTheDocument()
    
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText(adminLabels.spots.types.disabled)).toBeInTheDocument()
    
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText(adminLabels.spots.types.motorbike)).toBeInTheDocument()

    // Check statuses
    expect(screen.getByText(adminLabels.spots.status.available)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.spots.status.occupied)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.spots.status.unavailable)).toBeInTheDocument()
  })

  it('renders empty state when there are no spots', () => {
    const handleToggle = vi.fn()
    render(<SpotTable spots={[]} onToggleMaintenance={handleToggle} />)
    
    expect(screen.getByText(adminLabels.spots.emptyState)).toBeInTheDocument()
  })

  it('allows clicking maintenance button for non-occupied spots', () => {
    const handleToggle = vi.fn()
    render(<SpotTable spots={mockSpots} onToggleMaintenance={handleToggle} />)

    // Should find buttons for AVAILABLE and UNAVAILABLE spots (ids 1 and 3)
    const availableButton = screen.getByTitle(adminLabels.spots.maintenance.action)
    const restoreButton = screen.getByTitle(adminLabels.spots.maintenance.restoreAction)

    expect(availableButton).toBeInTheDocument()
    expect(restoreButton).toBeInTheDocument()

    fireEvent.click(availableButton)
    expect(handleToggle).toHaveBeenCalledWith(mockSpots[0])

    fireEvent.click(restoreButton)
    expect(handleToggle).toHaveBeenCalledWith(mockSpots[2])
  })

  it('does not render maintenance button for occupied spots', () => {
    const handleToggle = vi.fn()
    render(<SpotTable spots={mockSpots} onToggleMaintenance={handleToggle} />)

    // There are 3 spots, 2 buttons should be rendered (for available and unavailable)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })
})
