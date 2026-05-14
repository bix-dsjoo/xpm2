import { DataTable, type DataTableColumn } from "@/components/data-table"

import { useDevicesQuery } from "../model/queries"
import type { Device } from "../model/types"

const deviceColumns = [
  {
    key: "deviceType",
    header: "DEVICE TYPE",
  },
  {
    key: "deviceState",
    header: "DEVICE STATE",
  },
  {
    key: "deviceConnectionStatus",
    header: "DEVICE CONNECTION STATUS",
  },
  {
    key: "groups",
    header: "GROUPS",
  },
  {
    key: "groupPaths",
    header: "GROUPS PATHS",
  },
  {
    key: "activeProtocol",
    header: "ACTIVE PROTOCOL",
  },
  {
    key: "supportedProtocols",
    header: "SUPPORTED PROTOCOL",
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
    key: "activeIpAddress",
    header: "ACTIVE IP INSTANCE",
  },
] satisfies DataTableColumn<Device>[]

export const DevicesPage = () => {
  const { data: devices = [], isFetching } = useDevicesQuery()

  return (
    <main className="flex min-h-svh flex-col gap-6 p-6">
      <h1 className="font-medium">Devices</h1>
      <DataTable
        columns={deviceColumns}
        data={devices}
        loading={isFetching}
        getRowId={(row) => row.id}
      />
    </main>
  )
}
