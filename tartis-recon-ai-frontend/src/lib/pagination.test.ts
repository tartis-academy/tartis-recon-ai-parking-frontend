import { describe, it, expect } from 'vitest'
import { normalizePageResponse } from './pagination'

describe('normalizePageResponse', () => {
  it('should respond correctly to number (Spring 0-indexed -> UI 1-indexed)', () => {
    const springResponse = {
      content: ['item1', 'item2'],
      number: 0,
      size: 20,
      totalElements: 2,
      totalPages: 1
    }
    const result = normalizePageResponse(springResponse, 10)
    
    expect(result.page).toBe(1)
    expect(result.content).toEqual(['item1', 'item2'])
    expect(result.size).toBe(20)
    expect(result.totalElements).toBe(2)
  })

  it('should support fallback to page (legacy)', () => {
    const legacyResponse = {
      content: ['item'],
      page: 2,
      size: 15,
      totalElements: 1
    }
    const result = normalizePageResponse(legacyResponse, 10)
    
    expect(result.page).toBe(3)
    expect(result.size).toBe(15)
  })

  it('should handle flat array', () => {
    const arrayData = ['a', 'b', 'c']
    const result = normalizePageResponse(arrayData, 10)
    
    expect(result.page).toBe(1)
    expect(result.content).toEqual(['a', 'b', 'c'])
    expect(result.size).toBe(10)
    expect(result.totalElements).toBe(3)
    expect(result.totalPages).toBe(1)
  })

  it('should handle null or undefined gracefully', () => {
    const nullResult = normalizePageResponse(null, 15)
    expect(nullResult.content).toEqual([])
    expect(nullResult.page).toBe(1)
    expect(nullResult.size).toBe(15)
    expect(nullResult.totalElements).toBe(0)

    const undefinedResult = normalizePageResponse(undefined, 10)
    expect(undefinedResult.content).toEqual([])
    expect(undefinedResult.page).toBe(1)
    expect(undefinedResult.size).toBe(10)
    expect(undefinedResult.totalElements).toBe(0)
  })
})
