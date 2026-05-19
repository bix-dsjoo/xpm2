import { ChartCard } from "@/components/chart-card"
import { DevicesPageTable } from "./devices-page-table"

const deviceTypeData = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

const lastStateUpdateData = [
  { month: "January", desktop: 186, mobile: 125 },
  { month: "February", desktop: 305, mobile: 86 },
  { month: "March", desktop: 237, mobile: 402 },
  { month: "April", desktop: 73, mobile: 230 },
  { month: "May", desktop: 209, mobile: 123 },
  { month: "June", desktop: 214, mobile: 567 },
]

export const DevicesPage = () => {
  return (
    <div className="flex h-svh flex-col gap-6 p-6">
      <h1 className="font-medium">Devices</h1>

      <div className="flex gap-4">
        <ChartCard
          title="DEVICE TYPE"
          data={deviceTypeData}
          valueKey="visitors"
          categoryKey="browser"
          variant="radar"
        />

        <ChartCard
          title="DEVICE TYPE"
          data={deviceTypeData}
          valueKey="visitors"
          categoryKey="browser"
          variant="donut"
        />
        <ChartCard
          title="LAST STATE UPDATE"
          data={lastStateUpdateData}
          valueKey="desktop"
          categoryKey="month"
          variant="bar"
        />
        <ChartCard
          title="LAST STATE UPDATE"
          data={lastStateUpdateData}
          valueKey="desktop"
          categoryKey="month"
          variant="area"
        />
      </div>

      <DevicesPageTable />
    </div>
  )
}
