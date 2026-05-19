export const buildChartData = <TData extends Record<string, unknown>>(
  data: TData[],
  variant: "donut" | "bar",
  valueKey: Extract<keyof TData, string>,
  categoryKey: Extract<keyof TData, string>
) => {
  return data.map((item) => {
    if (variant === "bar") return { ...item, fill: `var(--color-${valueKey})` }

    return { ...item, fill: `var(--color-${item[categoryKey]})` }
  })
}
