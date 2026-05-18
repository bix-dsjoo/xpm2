import { type ChartField } from "@/base/model/chart"

export const DEVICE_CHART_FIELDS = {
  deviceType: {
    kind: "category",
  },
  deviceState: {
    kind: "category",
  },
  connectionStatus: {
    kind: "category",
  },
  complianceStatus: {
    kind: "category",
  },
  lastConnectionStatusChange: {
    kind: "time",
  },
} as const satisfies Record<string, ChartField>

export type DeviceChartField = keyof typeof DEVICE_CHART_FIELDS
