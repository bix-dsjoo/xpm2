import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  type PaginatedList,
  type PaginationParams,
} from "@/base/model/pagination"

function getPositiveNumberParam(
  searchParams: URLSearchParams,
  key: string,
  defaultValue: number
) {
  const value = Number(searchParams.get(key))

  return Number.isInteger(value) && value > 0 ? value : defaultValue
}

export function getPaginationParams(
  searchParams: URLSearchParams
): PaginationParams {
  const page = getPositiveNumberParam(searchParams, "page", DEFAULT_PAGE)
  const pageSize = getPositiveNumberParam(
    searchParams,
    "pageSize",
    DEFAULT_PAGE_SIZE
  )

  return {
    page,
    pageSize,
  }
}

export function paginateItems<T>(
  items: T[],
  params: PaginationParams
): PaginatedList<T> {
  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / params.pageSize)
  const page =
    totalPages === 0 ? DEFAULT_PAGE : Math.min(params.page, totalPages)
  const startIndex = (page - 1) * params.pageSize

  return {
    items: items.slice(startIndex, startIndex + params.pageSize),
    pagination: {
      page,
      pageSize: params.pageSize,
      totalItems,
      totalPages,
    },
  }
}
