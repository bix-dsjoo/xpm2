import * as React from "react"
import type { RowSelectionState } from "@tanstack/react-table"

export type Props = {
  initialSelectedRowIds?: string[]
}

function createRowSelectionState(rowIds: string[]): RowSelectionState {
  return Object.fromEntries(rowIds.map((rowId) => [rowId, true]))
}

export function useDataTableRowSelection({
  initialSelectedRowIds = [],
}: Props = {}) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    () => createRowSelectionState(initialSelectedRowIds)
  )

  const selectedRowIds = React.useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([rowId]) => rowId),
    [rowSelection]
  )

  const setSelectedRowIds = React.useCallback((rowIds: string[]) => {
    setRowSelection(createRowSelectionState(rowIds))
  }, [])

  const setSelectedRowId = React.useCallback((rowId: string | undefined) => {
    setRowSelection(rowId ? { [rowId]: true } : {})
  }, [])

  const clearRowSelection = React.useCallback(() => {
    setRowSelection({})
  }, [])

  return {
    rowSelection,
    onRowSelectionChange: setRowSelection,

    selectedRowIds,
    selectedRowId: selectedRowIds[0],

    setSelectedRowId,
    setSelectedRowIds,
    clearRowSelection,
  }
}
