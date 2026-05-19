import { Button } from "@/base/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/base/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/base/ui/chart"
import { buildChartConfig } from "../lib/build-chart-config"
import { buildChartData } from "../lib/build-chart-data"
import { SettingsIcon } from "lucide-react"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts"

export type ChartCardProps<TData extends Record<string, unknown>> = {
  title: string
  variant?: "donut" | "bar"
  data: TData[]
  valueKey: Extract<keyof TData, string>
  categoryKey: Extract<keyof TData, string>
}

export function ChartCard<TData extends Record<string, unknown>>({
  title,
  variant = "bar",
  data,
  valueKey,
  categoryKey,
}: ChartCardProps<TData>) {
  const chartConfig = useMemo(
    () => buildChartConfig(data, valueKey, categoryKey),
    [data, valueKey, categoryKey]
  )

  const coloredChartData = useMemo(
    () => buildChartData(data, variant, valueKey, categoryKey),
    [categoryKey, valueKey, variant, data]
  )

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>

        <Button variant="outline" size="icon">
          <SettingsIcon />
        </Button>
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
                data={coloredChartData}
                dataKey={valueKey}
                nameKey={categoryKey}
                innerRadius={60}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey={categoryKey} />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          )}
          {variant === "bar" && (
            <BarChart accessibilityLayer data={coloredChartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={categoryKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey={valueKey} fill="var(--chart-1)" radius={8} />
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
