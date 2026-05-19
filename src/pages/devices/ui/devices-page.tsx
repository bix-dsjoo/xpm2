import { DeviceTypeChart } from "./devices-page-device-type-chart"
import { LastStateUpdateChart } from "./devices-page-last-state-update-chart"
import { DevicesPageTable } from "./devices-page-table"

export const DevicesPage = () => {
  return (
    <main className="flex h-svh flex-col gap-6 p-6">
      <h1 className="font-medium">Devices</h1>

      <div className="flex gap-4">
        <DeviceTypeChart />
        <LastStateUpdateChart />
      </div>

      <DevicesPageTable />
    </main>
  )
}
