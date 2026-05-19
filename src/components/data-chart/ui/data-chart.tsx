import { Card, CardContent, CardHeader, CardTitle } from "@/base/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/base/ui/chart"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts"
import type { ChartData } from "recharts/types/state/chartDataSlice"

type Props<TData extends Record<string, unknown>> = {
  title: string
  variant?: "donut" | "bar"
  chartConfig: ChartConfig
  chartData: ChartData<TData>
  dataKey: Extract<keyof TData, string>
  nameKey: Extract<keyof TData, string>
}
export function DataChart<TData extends Record<string, unknown>>({
  title,
  variant = "bar",
  chartConfig,
  chartData,
  dataKey,
  nameKey,
}: Props<TData>) {
  const chartDataWithFill = useMemo(
    () =>
      chartData.map((d) => {
        if (variant === "bar") return { ...d, fill: `var(--color-${dataKey})` }
        return { ...d, fill: `var(--color-${d[nameKey]})` }
      }),
    [dataKey, nameKey, variant, chartData]
  )

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
          {variant === "donut" && (
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartDataWithFill}
                dataKey={dataKey}
                nameKey={nameKey}
                innerRadius={60}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey={nameKey} />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          )}
          {variant === "bar" && (
            <BarChart accessibilityLayer data={chartDataWithFill}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={nameKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey={dataKey} fill="var(--chart-1)" radius={8} />
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
