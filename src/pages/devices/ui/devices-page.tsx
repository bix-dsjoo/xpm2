import { Button } from "@/base/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/base/ui/table"

import { useDevicesQuery } from "../model/queries"

const tableColumns = [
  "Device ID",
  "Device Type",
  "Device State",
  "Device Connection Status",
  "Groups",
  "Group Paths",
  "Active Protocol",
  "Supported Protocols",
  "Protocol Adapter",
  "Protocol Instance",
  "Active IP Address",
]

export const DevicesPage = () => {
  const { data: devices = [], isFetching, refetch } = useDevicesQuery()

  return (
    <main className="flex min-h-svh flex-col gap-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-normal">Devices</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Check each device's health, connection, group, and IP address.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={isFetching}
          onClick={() => void refetch()}
        >
          Refresh
        </Button>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            {tableColumns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>{device.id}</TableCell>
              <TableCell>{device.deviceType}</TableCell>
              <TableCell>{device.deviceState}</TableCell>
              <TableCell>{device.deviceConnectionStatus}</TableCell>
              <TableCell>{device.groups.join(", ")}</TableCell>
              <TableCell>{device.groupPaths.join(", ")}</TableCell>
              <TableCell>{device.activeProtocol}</TableCell>
              <TableCell>{device.supportedProtocols.join(", ")}</TableCell>
              <TableCell>{device.protocolAdapter}</TableCell>
              <TableCell>{device.protocolInstance}</TableCell>
              <TableCell>{device.activeIpAddress}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
