import { Button } from "@/base/ui/button"
import { ButtonGroup } from "@/base/ui/button-group"
import { MoveLeftIcon, MoveRightIcon } from "lucide-react"
import type { DataTablePaginationMeta } from "../model/types"

type DataTablePaginationProps = {
  pagination: DataTablePaginationMeta
  onPageChange: (page: number) => void
}

export function DataTablePagination({
  pagination,
  onPageChange,
}: DataTablePaginationProps) {
  const totalPages = pagination?.totalPages ?? 0

  const currentPage = totalPages === 0 ? 0 : pagination.page
  const canGoPrevious = pagination.page > 1 && totalPages > 0
  const canGoNext = pagination.page < totalPages && totalPages > 0

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
        {currentPage} of {totalPages}
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
