export interface SpringPageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  page: number
  size: number
  totalPages?: number
}

export function normalizePageResponse<T>(
  data: Partial<SpringPageResponse<T>> & { page?: number } | T[] | null | undefined,
  fallbackPageSize: number,
): PaginatedResponse<T> {
  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      page: 1,
      size: fallbackPageSize,
      totalPages: 1,
    }
  }

  const safeData = data || {}
  return {
    ...safeData,
    content: safeData.content ?? [],
    page: (safeData.number ?? safeData.page ?? 0) + 1,
    size: safeData.size ?? fallbackPageSize,
    totalElements: safeData.totalElements ?? 0,
    totalPages: safeData.totalPages ?? 1,
  }
}
