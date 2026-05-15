import { TableCell, TableRow } from "@/base/ui/table"

export function DataTableEmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} />
    </TableRow>
  )
}
