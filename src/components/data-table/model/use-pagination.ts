import * as React from "react"

type Props = {
  initialPage?: number
  initialPageSize?: number
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 25

export function useDataTablePagination({
  initialPage = DEFAULT_PAGE,
  initialPageSize = DEFAULT_PAGE_SIZE,
}: Props = {}) {
  const [page, setPage] = React.useState(initialPage)
  const [pageSize, setPageSize] = React.useState(initialPageSize)

  const onPageSizeChange = React.useCallback((nextPageSize: number) => {
    setPage(DEFAULT_PAGE)
    setPageSize(nextPageSize)
  }, [])

  return {
    page,
    pageSize,
    totalPages: 0,
    totalItems: 0,
    setPage,
    setPageSize,
    onPageChange: setPage,
    onPageSizeChange,
  }
}
