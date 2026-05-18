import { Card, CardContent, CardHeader, CardTitle } from "@/base/ui/card"
import type { ChartData } from "@/base/model/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/base/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

type ChartBarDefaultProps = {
  data?: ChartData
  title: string
}

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function formatXAxisTick(value: unknown, kind?: ChartData["kind"]) {
  const label = String(value)

  if (kind === "time") {
    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(label)

    if (dateOnlyMatch) {
      const [, , month, day] = dateOnlyMatch

      return `${month}-${day}`
    }
  }

  return label.slice(0, 12)
}

export const ChartBarDefault = ({ data, title }: ChartBarDefaultProps) => {
  const chartData =
    data?.buckets.map((bucket) => ({
      label: bucket.label,
      count: bucket.count,
    })) ?? []

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
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              height={36}
              axisLine={false}
              tickFormatter={(value) => formatXAxisTick(value, data?.kind)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--chart-1)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
