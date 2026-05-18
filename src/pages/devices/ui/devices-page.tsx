import { ChartPieDonut } from "./devices-page-chart-pie-donut"
import { ChartBarDefault } from "./devices-page-chart-bar-default"
import { DevicesPageTable } from "./devices-page-table"
import { useDeviceChartPreferencesQuery } from "../model/queries"

export const DevicesPage = () => {
  const { data } = useDeviceChartPreferencesQuery()
  console.log(data)
  return (
    <main className="flex h-svh flex-col gap-6 p-6">
      <h1 className="font-medium">Devices</h1>

      <div className="flex gap-4">
        <ChartPieDonut />
        <ChartBarDefault />
      </div>

      <DevicesPageTable />
    </main>
  )
}
