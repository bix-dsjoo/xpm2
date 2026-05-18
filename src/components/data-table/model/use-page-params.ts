import * as React from "react"

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/base/model/pagination"

type Props = {
  initialPage?: number
  initialPageSize?: number
}

export function useDataTablePageParams({
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
    setPage,
    setPageSize,
    onPageChange: setPage,
    onPageSizeChange,
  }
}
