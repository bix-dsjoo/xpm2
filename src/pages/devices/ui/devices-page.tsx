import { DataTable, type DataTableColumn } from "@/components/data-table"

import { useDevicesQuery } from "../model/queries"
import {
  DEVICE_STATE_OPTIONS,
  deviceConnectionStatusOptions,
  type Device,
} from "../model/types"

const deviceColumns = [
  {
    key: "deviceName",
    header: "DEVICE NAME",
  },
  {
    key: "deviceType",
    header: "DEVICE TYPE",
  },
  {
    key: "deviceState",
    header: "DEVICE STATE",
    type: "option",
    options: DEVICE_STATE_OPTIONS,
  },
  {
    key: "deviceConnectionStatus",
    header: "DEVICE CONNECTION STATUS",
    type: "option",
    options: deviceConnectionStatusOptions,
  },
  {
    key: "isManaged",
    header: "MANAGED",
    type: "boolean",
  },
  {
    key: "alertCount",
    header: "ALERTS",
    type: "number",
  },
  {
    key: "lastConnectedAt",
    header: "LAST CONNECTED",
    type: "date",
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
