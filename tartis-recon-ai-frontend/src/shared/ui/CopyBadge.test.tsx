import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CopyBadge } from './CopyBadge'
import { useToastStore } from '@/shared/stores/useToastStore'

describe('CopyBadge', () => {
  let writeTextMock: ReturnType<typeof vi.fn>
  let addToastSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    })
    addToastSpy = vi.spyOn(useToastStore.getState(), 'addToast')
    addToastSpy.mockClear()
  })

  it('truncates UUID-like values by default', () => {
    render(<CopyBadge value="trf-e8a3b000-1234-5678-9abc-def012345678" />)
    expect(screen.getByText('trf-e8a3...')).toBeInTheDocument()
  })

  it('renders short, non-UUID values in full', () => {
    render(<CopyBadge value="veh-uvwx222" />)
    expect(screen.getByText('veh-uvwx222')).toBeInTheDocument()
  })

  it('prefers an explicit displayValue over auto-truncation', () => {
    render(<CopyBadge value="trf-e8a3b000-1234-5678-9abc-def012345678" displayValue="0,05€/min" />)
    expect(screen.getByText('0,05€/min')).toBeInTheDocument()
  })

  it('includes the full value in the default title', () => {
    render(<CopyBadge value="veh-uvwx222" />)
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Copiar ID completo: veh-uvwx222')
  })

  it('copies the full value to the clipboard and shows a toast on click', async () => {
    render(<CopyBadge value="trf-e8a3b000-1234-5678-9abc-def012345678" />)

    fireEvent.click(screen.getByRole('button'))
    await vi.waitFor(() => {
      expect(addToastSpy).toHaveBeenCalledWith({ message: 'ID copiado al portapapeles', type: 'info' })
    })

    expect(writeTextMock).toHaveBeenCalledWith('trf-e8a3b000-1234-5678-9abc-def012345678')
  })
})
