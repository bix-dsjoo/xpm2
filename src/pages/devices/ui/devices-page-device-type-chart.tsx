import { ChartCard } from "@/components/chart-card"

const deviceTypeData = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

export const DeviceTypeChart = () => {
  return (
    <ChartCard
      title="DEVICE TYPE"
      data={deviceTypeData}
      valueKey="visitors"
      categoryKey="browser"
      variant="donut"
    />
  )
}
