import { type ChartConfig } from "@/base/ui/chart"
import { DataChart } from "@/components/data-chart"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  January: {
    label: "January",
    color: "var(--chart-1)",
  },
  February: {
    label: "February",
    color: "var(--chart-2)",
  },
  March: {
    label: "March",
    color: "var(--chart-3)",
  },
  April: {
    label: "April",
    color: "var(--chart-4)",
  },
  May: {
    label: "may",
    color: "var(--chart-5)",
  },
  June: {
    label: "June",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig

export const ChartBarDefault = () => {
  return (
    <DataChart
      title="LAST STATE UPDATE"
      chartConfig={chartConfig}
      chartData={chartData}
      dataKey="desktop"
      nameKey="month"
      variant="donut"
    />
  )
}
