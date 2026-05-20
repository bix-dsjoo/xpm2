import { DataChart } from "@/components/data-chart"
import { DevicesPageTable } from "./devices-page-table"
import type { ChartVariant } from "@/components/data-chart/model/types"

const preferences = [
  {
    id: "1",
    variant: "radar",
    query: {
      propertyKey: "deviceStatus",
      type: "category",
      bucketsCount: 5,
    },
  },
  {
    id: "2",
    variant: "donut",
    query: {
      propertyKey: "deviceType",
      type: "category",
      bucketsCount: 5,
    },
  },
  {
    id: "3",
    variant: "area",
    query: {
      propertyKey: "printJobs",
      type: "time",
      bucketsCount: 5,
      timeInterval: "hour",
    },
  },
  {
    id: "4",
    variant: "bar",
    query: {
      propertyKey: "connectionCount",
      type: "time",
      bucketsCount: 5,
      timeInterval: "day",
    },
  },
]

const charts = [
  {
    preferenceId: "1",
    total: 431,
    buckets: [
      { key: "normal", value: 75 },
      { key: "warning", value: 64 },
      { key: "offline", value: 43 },
      { key: "error", value: 28 },
      { key: "maintenance", value: 12 },
      { key: "other", value: 9, isOther: true },
    ],
  },
  {
    preferenceId: "2",
    total: 409,
    buckets: [
      { key: "pos", value: 142 },
      { key: "kiosk", value: 86 },
      { key: "mobile", value: 74 },
      { key: "label", value: 58 },
      { key: "supplies", value: 31 },
      { key: "other", value: 18, isOther: true },
    ],
  },
  {
    preferenceId: "3",
    total: 338,
    buckets: [
      { key: "earlier", value: 96, isOther: true },
      {
        key: "09:00",
        value: 32,
        startedAt: "2026-05-20T09:00:00+09:00",
        endedAt: "2026-05-20T10:00:00+09:00",
      },
      {
        key: "10:00",
        value: 48,
        startedAt: "2026-05-20T10:00:00+09:00",
        endedAt: "2026-05-20T11:00:00+09:00",
      },
      {
        key: "11:00",
        value: 61,
        startedAt: "2026-05-20T11:00:00+09:00",
        endedAt: "2026-05-20T12:00:00+09:00",
      },
      {
        key: "12:00",
        value: 44,
        startedAt: "2026-05-20T12:00:00+09:00",
        endedAt: "2026-05-20T13:00:00+09:00",
      },
      {
        key: "13:00",
        value: 57,
        startedAt: "2026-05-20T13:00:00+09:00",
        endedAt: "2026-05-20T14:00:00+09:00",
      },
    ],
  },
  {
    preferenceId: "4",
    total: 1303,
    buckets: [
      { key: "earlier", value: 221, isOther: true },
      {
        key: "2026-05-16",
        value: 186,
        startedAt: "2026-05-16T00:00:00+09:00",
        endedAt: "2026-05-17T00:00:00+09:00",
      },
      {
        key: "2026-05-17",
        value: 214,
        startedAt: "2026-05-17T00:00:00+09:00",
        endedAt: "2026-05-18T00:00:00+09:00",
      },
      {
        key: "2026-05-18",
        value: 203,
        startedAt: "2026-05-18T00:00:00+09:00",
        endedAt: "2026-05-19T00:00:00+09:00",
      },
      {
        key: "2026-05-19",
        value: 248,
        startedAt: "2026-05-19T00:00:00+09:00",
        endedAt: "2026-05-20T00:00:00+09:00",
      },
      {
        key: "2026-05-20",
        value: 231,
        startedAt: "2026-05-20T00:00:00+09:00",
        endedAt: "2026-05-21T00:00:00+09:00",
      },
    ],
  },
]

export const DevicesPage = () => {
  const chartMap = new Map(charts.map((c) => [c.preferenceId, c]))

  return (
    <div className="flex h-svh flex-col gap-6 p-6">
      <h1 className="font-medium">Devices</h1>

      <div className="flex gap-4">
        {preferences.map((p) => {
          const c = chartMap.get(p.id)

          if (!c) {
            return null
          }

          return (
            <DataChart
              key={p.id}
              data={c.buckets}
              valueKey="value"
              categoryKey="key"
              variant={p.variant as ChartVariant}
            />
          )
        })}
      </div>

      <DevicesPageTable />
    </div>
  )
}
