import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/base/ui/chart"
import { buildChartData } from "../lib/build-chart-data"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
} from "recharts"
import type * as React from "react"

export type ChartRendererProps<TData extends Record<string, unknown>> = {
  data: TData[]
  valueKey: Extract<keyof TData, string>
  categoryKey: Extract<keyof TData, string>
}

export type ChartRenderer = <TData extends Record<string, unknown>>(
  props: ChartRendererProps<TData>
) => React.ReactElement

export const DonutChartRenderer = <TData extends Record<string, unknown>>({
  data,
  valueKey,
  categoryKey,
}: ChartRendererProps<TData>) => {
  const coloredData = buildChartData(data, categoryKey)

  return (
    <PieChart>
      <ChartTooltip
        cursor={false}
        content={<ChartTooltipContent hideLabel />}
      />
      <Pie
        data={coloredData}
        dataKey={valueKey}
        nameKey={categoryKey}
        innerRadius={60}
      />
      <ChartLegend
        content={<ChartLegendContent nameKey={categoryKey} />}
        className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
      />
    </PieChart>
  )
}

export const BarChartRenderer = <TData extends Record<string, unknown>>({
  data,
  valueKey,
  categoryKey,
}: ChartRendererProps<TData>) => {
  return (
    <BarChart accessibilityLayer data={data}>
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
      <Bar
        dataKey={valueKey}
        fill={`var(--color-${valueKey})`}
        radius={8}
      />
    </BarChart>
  )
}

export const AreaChartRenderer = <TData extends Record<string, unknown>>({
  data,
  valueKey,
  categoryKey,
}: ChartRendererProps<TData>) => {
  return (
    <AreaChart
      accessibilityLayer
      data={data}
      margin={{
        left: 12,
        right: 12,
      }}
    >
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey={categoryKey}
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tickFormatter={(value) => value.slice(0, 3)}
      />
      <ChartTooltip
        cursor={false}
        content={<ChartTooltipContent indicator="line" />}
      />
      <Area
        dataKey={valueKey}
        type="natural"
        fill={`var(--color-${valueKey})`}
        fillOpacity={0.4}
        stroke={`var(--color-${valueKey})`}
      />
    </AreaChart>
  )
}

export const RadarChartRenderer = <TData extends Record<string, unknown>>({
  data,
  valueKey,
  categoryKey,
}: ChartRendererProps<TData>) => {
  return (
    <RadarChart data={data}>
      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
      <PolarAngleAxis dataKey={categoryKey} />
      <PolarGrid />
      <Radar
        dataKey={valueKey}
        fill={`var(--color-${valueKey})`}
        fillOpacity={0.6}
      />
    </RadarChart>
  )
}
