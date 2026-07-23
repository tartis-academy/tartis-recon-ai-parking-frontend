import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('displays current page range and total records', () => {
    const onChange = vi.fn()
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={47}
        onChange={onChange}
      />,
    )

    expect(screen.getByText('1 - 10 de 47 registros')).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    const onChange = vi.fn()
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={47}
        onChange={onChange}
      />,
    )

    const previousButton = screen.getByRole('button', { name: /anterior/i })
    expect(previousButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    const onChange = vi.fn()
    render(
      <Pagination
        page={5}
        pageSize={10}
        total={47}
        onChange={onChange}
      />,
    )

    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    expect(nextButton).toBeDisabled()
  })

  it('calls onChange with next page when next button is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={47}
        onChange={onChange}
      />,
    )

    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    await user.click(nextButton)

    expect(onChange).toHaveBeenCalledWith({ page: 2, pageSize: 10 })
  })

  it('calls onChange with previous page when previous button is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Pagination
        page={2}
        pageSize={10}
        total={47}
        onChange={onChange}
      />,
    )

    const previousButton = screen.getByRole('button', { name: /anterior/i })
    await user.click(previousButton)

    expect(onChange).toHaveBeenCalledWith({ page: 1, pageSize: 10 })
  })

  it('calls onChange with new pageSize when page size selector changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Pagination
        page={2}
        pageSize={10}
        total={47}
        onChange={onChange}
      />,
    )

    const pageSizeSelect = screen.getByLabelText(/registros por página/i)
    await user.selectOptions(pageSizeSelect, '25')

    expect(onChange).toHaveBeenCalledWith({ page: 1, pageSize: 25 })
  })
})
