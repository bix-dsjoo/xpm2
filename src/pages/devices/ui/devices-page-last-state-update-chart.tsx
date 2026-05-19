import { ChartCard } from "@/components/chart-card"

const lastStateUpdateData = [
  { month: "January", desktop: 186, mobile: 125 },
  { month: "February", desktop: 305, mobile: 86 },
  { month: "March", desktop: 237, mobile: 402 },
  { month: "April", desktop: 73, mobile: 230 },
  { month: "May", desktop: 209, mobile: 123 },
  { month: "June", desktop: 214, mobile: 567 },
]

export const LastStateUpdateChart = () => {
  return (
    <ChartCard
      title="LAST STATE UPDATE"
      data={lastStateUpdateData}
      valueKey="desktop"
      categoryKey="month"
      variant="bar"
    />
  )
}
