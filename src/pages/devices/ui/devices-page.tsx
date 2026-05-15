import { DataTable, type DataTableColumn } from "@/components/data-table"

import { useDevicesQuery } from "../model/queries"
import {
  DEVICE_COMPLIANCE_STATUS_OPTIONS,
  DEVICE_CONNECTION_STATUS_OPTIONS,
  DEVICE_STATE_OPTIONS,
  type Device,
} from "../model/types"
import { ChartPieDonut } from "./devices-page-chart-pie-donut"
import { ChartBarDefault } from "./devices-page-chart-bar-default"

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

export const DevicesPage = () => {
  const { data: devices = [], isFetching } = useDevicesQuery()

  return (
    <main className="flex h-svh flex-col gap-6 p-6">
      <h1 className="font-medium">Devices</h1>

      <div className="flex gap-4">
        <ChartPieDonut />
        <ChartBarDefault />
      </div>

      <DataTable
        columns={deviceColumns}
        data={devices}
        loading={isFetching}
        getRowId={(row) => row.deviceId}
      />
    </main>
  )
}
