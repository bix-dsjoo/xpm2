import { Button } from "@/base/ui/button"
import {
  DataTable,
  useDataTableRowSelection,
  type DataTableColumn,
} from "@/components/data-table"

import {
  DEVICE_COMPLIANCE_STATUS_OPTIONS,
  DEVICE_CONNECTION_STATUS_OPTIONS,
  DEVICE_STATE_OPTIONS,
  type Device,
  type DevicesPagination,
} from "../model/types"

const deviceColumns = [
  {
    key: "deviceName",
    header: "DEVICE NAME",
    cell: ({ getValue }) => (
      <Button className={"px-0"} variant="link">
        {getValue<string>()}
      </Button>
    ),
  },
  {
    key: "deviceType",
    header: "DEVICE TYPE",
  },
  {
    key: "complianceStatus",
    header: "COMPLIANCE STATUS",
    type: "option",
    options: DEVICE_COMPLIANCE_STATUS_OPTIONS,
  },
  {
    key: "deviceState",
    header: "DEVICE STATE",
    type: "option",
    options: DEVICE_STATE_OPTIONS,
  },
  {
    key: "connectionStatus",
    header: "CONNECTION STATUS",
    type: "option",
    options: DEVICE_CONNECTION_STATUS_OPTIONS,
  },
  {
    key: "lastConnectionStatusChange",
    header: "LAST CONNECTION STATUS CHANGE",
    type: "date-time",
  },
  {
    key: "activeIpAddress",
    header: "ACTIVE IP ADDRESS",
  },
  {
    key: "activeProtocol",
    header: "ACTIVE PROTOCOL",
  },
  {
    key: "supportedProtocols",
    header: "SUPPORTED PROTOCOLS",
    type: "array",
  },
  {
    key: "protocolAdapter",
    header: "PROTOCOL ADAPTER",
  },
  {
    key: "protocolInstance",
    header: "PROTOCOL INSTANCE",
  },
  {
    key: "groups",
    header: "GROUPS",
    type: "array",
  },
  {
    key: "groupPaths",
    header: "GROUP PATHS",
    type: "array",
  },
] satisfies DataTableColumn<Device>[]

type DevicesPageTableProps = {
  data?: Device[]
  pagination?: DevicesPagination
  loading: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onRefresh: () => void
}

export function DevicesPageTable({
  data,
  pagination,
  loading,
  onPageChange,
  onPageSizeChange,
  onRefresh,
}: DevicesPageTableProps) {
  const { rowSelection, onRowSelectionChange } = useDataTableRowSelection()

  return (
    <DataTable
      columns={deviceColumns}
      data={data}
      pagination={pagination}
      loading={loading}
      getRowId={(row) => row.deviceId}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRefresh={onRefresh}
      selection={{
        rowSelection,
        onRowSelectionChange,
      }}
    />
  )
}
