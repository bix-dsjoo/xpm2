import type { PaginationMeta } from "@/base/model/pagination"
import { Button } from "@/base/ui/button"
import { ButtonGroup } from "@/base/ui/button-group"
import { MoveLeftIcon, MoveRightIcon } from "lucide-react"

type DataTablePaginationProps = {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
}

export function DataTablePagination({
  pagination,
  onPageChange,
}: DataTablePaginationProps) {
  const currentPage = pagination.totalPages === 0 ? 0 : pagination.page
  const canGoPrevious = pagination.page > 1 && pagination.totalPages > 0
  const canGoNext =
    pagination.page < pagination.totalPages && pagination.totalPages > 0

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        disabled={!canGoPrevious}
        onClick={() => onPageChange(pagination.page - 1)}
        aria-label="Previous page"
      >
        <MoveLeftIcon />
      </Button>

      <Button className="text-xs font-normal" variant="outline" disabled>
        {currentPage} of {pagination.totalPages}
      </Button>

      <Button
        variant="outline"
        disabled={!canGoNext}
        onClick={() => onPageChange(pagination.page + 1)}
        aria-label="Next page"
      >
        <MoveRightIcon />
      </Button>
    </ButtonGroup>
  )
}
