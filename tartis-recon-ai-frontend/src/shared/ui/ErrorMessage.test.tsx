import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ErrorMessage } from './ErrorMessage'

describe('ErrorMessage', () => {
  it('renders children content correctly', () => {
    render(<ErrorMessage>Ocurrió un error en el servidor</ErrorMessage>)

    expect(screen.getByText('Ocurrió un error en el servidor')).toBeInTheDocument()
  })

  it('renders error icon SVG', () => {
    const { container } = render(<ErrorMessage>Error</ErrorMessage>)

    const svgElement = container.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
  })
})
