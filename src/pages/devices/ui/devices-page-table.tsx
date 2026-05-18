import {
  DataTable,
  useDataTablePageParams,
  useDataTableRowSelection,
} from "@/components/data-table"

import { deviceTableColumns } from "../config/device-table-columns"
import { useDevicesQuery } from "../model/queries"

export function DevicesPageTable() {
  const paginationState = useDataTablePageParams()

  const { data, isFetching, refetch } = useDevicesQuery({
    page: paginationState.page,
    pageSize: paginationState.pageSize,
  })

  const selection = useDataTableRowSelection()
  const paginationMeta = data?.pagination

  return (
    <DataTable
      title="Devices"
      columns={deviceTableColumns}
      data={data?.items}
      pagination={{
        page: paginationState.page,
        pageSize: paginationState.pageSize,
        totalItems: paginationMeta?.totalItems ?? 0,
        totalPages: paginationMeta?.totalPages ?? 0,
        onPageChange: paginationState.onPageChange,
        onPageSizeChange: paginationState.onPageSizeChange,
      }}
      selection={selection}
      loading={isFetching}
      getRowId={(row) => row.id}
      onRefresh={refetch}
    />
  )
}
