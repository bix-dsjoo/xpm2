import type { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/base/ui/checkbox"

import type { DataTableSelectionMode } from "../model/types"

const DATA_TABLE_SELECTION_COLUMN_ID = "data-table-selection"

type Props = {
  mode: DataTableSelectionMode
}

export function createDataTableSelectionColumn<TData>({
  mode,
}: Props): ColumnDef<TData> {
  return {
    id: DATA_TABLE_SELECTION_COLUMN_ID,
    header: ({ table }) => {
      if (mode === "single") {
        return null
      }

      const isAllPageRowsSelected = table.getIsAllPageRowsSelected()

      return (
        <Checkbox
          checked={isAllPageRowsSelected}
          indeterminate={
            !isAllPageRowsSelected && table.getIsSomePageRowsSelected()
          }
          onCheckedChange={(checked) => {
            table.toggleAllPageRowsSelected(checked)
          }}
          aria-label="Select all rows"
        />
      )
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => {
          row.toggleSelected(checked)
        }}
        aria-label="Select row"
      />
    ),
    meta: {
      align: "center",
    },
  }
}
