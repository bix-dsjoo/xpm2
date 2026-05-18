export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 25
export const PAGE_SIZE_OPTIONS = [25, 50, 75, 100] as const

export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number]

export type PaginationParams = {
  page: number
  pageSize: number
}

export type PaginationMeta = PaginationParams & {
  totalItems: number
  totalPages: number
}

export type PaginatedResponse<T> = {
  items: T[]
  pagination: PaginationMeta
}
