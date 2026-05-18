import { Card, CardContent, CardHeader, CardTitle } from "@/base/ui/card"
import type { CategoryChartData } from "@/base/model/chart"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/base/ui/chart"
import { Pie, PieChart } from "recharts"

type ChartPieDonutProps = {
  data?: CategoryChartData
  title: string
}

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

export const ChartPieDonut = ({ data, title }: ChartPieDonutProps) => {
  const chartData =
    data?.buckets.map((bucket, index) => ({
      label: bucket.label,
      count: bucket.count,
      fill: chartColors[index % chartColors.length],
    })) ?? []

  const chartConfig = {
    count: {
      label: "Count",
    },
    ...Object.fromEntries(
      chartData.map((bucket) => [
        bucket.label,
        {
          label: bucket.label,
          color: bucket.fill,
        },
      ])
    ),
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-80"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="label"
              innerRadius={60}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="label" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
