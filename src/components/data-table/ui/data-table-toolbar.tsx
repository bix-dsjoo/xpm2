import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/base/ui/button"

import { DataTableTitle } from "./data-table-title"
import { DataTablePageSizeSelect } from "./data-table-page-size-select"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableActions } from "./data-table-actions"

export function DataTableToolbar() {
  return (
    <header className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <DataTableTitle title="Devices" description="(1-10 of 10)" />

        <DataTablePageSizeSelect />

        <DataTablePagination />

        <Button size="icon" variant="ghost">
          <RefreshCwIcon />
        </Button>
      </div>

      <DataTableActions />
    </header>
  )
}
