import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AdminSidebar } from './AdminSidebar'
import { adminLabels } from '../labels'

import type { ReactNode } from 'react'

// Mock `useLocation` y `Link` de @tanstack/react-router
vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ pathname: '/admin/vehicles' }),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Link: ({ children, to, className, 'aria-current': ariaCurrent }: { children: ReactNode; to: string; className?: string; 'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean }) => (
    <a href={to} className={className} aria-current={ariaCurrent}>
      {children}
    </a>
  ),
}))

describe('AdminSidebar', () => {
  it('renders correctly when sidebar is open', () => {
    const toggleSidebar = vi.fn()
    render(<AdminSidebar isSidebarOpen={true} toggleSidebar={toggleSidebar} />)
    
    // Check if texts and logo are rendered
    expect(screen.getByText(adminLabels.layout.logo)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.layout.subtitle)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.layout.adminName)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.layout.adminRole)).toBeInTheDocument()
    
    // Check nav links
    expect(screen.getByText(adminLabels.layout.vehicles)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.layout.spots)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.layout.tariffs)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.layout.stays)).toBeInTheDocument()
    expect(screen.getByText(adminLabels.layout.tickets)).toBeInTheDocument()
  })

  it('renders correctly when sidebar is collapsed', () => {
    const toggleSidebar = vi.fn()
    render(<AdminSidebar isSidebarOpen={false} toggleSidebar={toggleSidebar} />)
    
    // Text elements should not be rendered
    expect(screen.queryByText(adminLabels.layout.logo)).not.toBeInTheDocument()
    expect(screen.queryByText(adminLabels.layout.adminRole)).not.toBeInTheDocument()
    expect(screen.queryByText(adminLabels.layout.vehicles)).not.toBeInTheDocument()
    expect(screen.queryByText(adminLabels.layout.spots)).not.toBeInTheDocument()
    
    // Initials should still be rendered (Álvaro Orta -> ÁO)
    expect(screen.getByText('ÁO')).toBeInTheDocument()
  })

  it('calls toggleSidebar when toggle button is clicked', async () => {
    const toggleSidebar = vi.fn()
    const user = userEvent.setup()
    render(<AdminSidebar isSidebarOpen={true} toggleSidebar={toggleSidebar} />)
    
    const button = screen.getByRole('button', { name: adminLabels.layout.collapseSidebar })
    await user.click(button)
    expect(toggleSidebar).toHaveBeenCalledTimes(1)
  })

  it('highlights the active link based on current path', () => {
    render(<AdminSidebar isSidebarOpen={true} toggleSidebar={vi.fn()} />)
    
    const vehiclesLink = screen.getByRole('link', { name: new RegExp(adminLabels.layout.vehicles) })
    expect(vehiclesLink).toHaveAttribute('aria-current', 'page')
    
    const spotsLink = screen.getByRole('link', { name: new RegExp(adminLabels.layout.spots) })
    expect(spotsLink).not.toHaveAttribute('aria-current')
  })
})
