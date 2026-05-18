import { delay, http, HttpResponse } from "msw"

import type {
  CategoryChartBucket,
  ChartInterval,
  TimeChartBucket,
} from "@/base/model/chart"

import {
  DEVICE_CHART_PREFERENCES_API_PATH,
  DEVICE_CHARTS_QUERY_API_PATH,
  DEVICES_API_PATH,
} from "./api"
import type {
  DeviceChartPreferencesResult,
  DeviceChartsQueryRequest,
} from "./dto"
import { DEVICE_CHART_FIELDS, type DeviceChartField } from "../config/chart"
import type { Device } from "../model/types"

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 25
const PAGE_SIZE_OPTIONS = [25, 50, 75, 100] as const
const DEFAULT_TIME_ZONE = "+09:00"
const DEFAULT_CHART_INTERVAL = "day" satisfies ChartInterval
const MILLISECONDS_PER_SECOND = 1000
const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND
const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR

function getNumberParam(
  searchParams: URLSearchParams,
  key: string,
  defaultValue: number
) {
  const value = Number(searchParams.get(key))

  return Number.isInteger(value) && value > 0 ? value : defaultValue
}

function getPageSize(searchParams: URLSearchParams) {
  const pageSize = getNumberParam(searchParams, "pageSize", DEFAULT_PAGE_SIZE)

  return PAGE_SIZE_OPTIONS.includes(
    pageSize as (typeof PAGE_SIZE_OPTIONS)[number]
  )
    ? pageSize
    : DEFAULT_PAGE_SIZE
}

function getPaginatedDevices(request: Request, source: Device[]) {
  const url = new URL(request.url)
  const pageSize = getPageSize(url.searchParams)
  const totalItems = source.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const requestedPage = getNumberParam(url.searchParams, "page", DEFAULT_PAGE)
  const page =
    totalPages === 0 ? DEFAULT_PAGE : Math.min(requestedPage, totalPages)
  const startIndex = (page - 1) * pageSize

  return {
    items: source.slice(startIndex, startIndex + pageSize),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && value > 0
}

function isDeviceChartField(value: unknown): value is DeviceChartField {
  return typeof value === "string" && value in DEVICE_CHART_FIELDS
}

function parseDeviceChartsQueryRequest(
  value: unknown
): DeviceChartsQueryRequest | null {
  if (!isRecord(value) || !Array.isArray(value.charts)) {
    return null
  }

  const charts = value.charts.filter((chart) => {
    if (!isRecord(chart) || typeof chart.id !== "string") {
      return false
    }

    const { query } = chart

    return (
      isRecord(query) &&
      isDeviceChartField(query.field) &&
      isPositiveInteger(query.limit)
    )
  }) as DeviceChartsQueryRequest["charts"]

  return charts.length === value.charts.length ? { charts } : null
}

function getDeviceChartData(
  item: DeviceChartsQueryRequest["charts"][number],
  source: Device[]
) {
  const { id, query } = item
  const field = query.field
  const definition = DEVICE_CHART_FIELDS[field]

  if (definition.kind === "category") {
    return {
      id,
      field,
      kind: "category" as const,
      buckets: getCategoryBuckets(source, field, query.limit),
    }
  }

  const interval = query.interval ?? DEFAULT_CHART_INTERVAL

  return {
    id,
    field,
    kind: "time" as const,
    interval,
    buckets: getTimeBuckets(
      source,
      field,
      interval,
      query.limit,
      query.timeZone ?? DEFAULT_TIME_ZONE
    ),
  }
}

function getCategoryBuckets(
  source: Device[],
  field: DeviceChartField,
  limit: number
): CategoryChartBucket[] {
  const counts = new Map<string, number>()

  source.forEach((device) => {
    const label = String(device[field])
    counts.set(label, (counts.get(label) ?? 0) + 1)
  })

  const buckets = Array.from(counts, ([label, count]) => ({
    label,
    count,
  })).sort((left, right) => right.count - left.count)

  if (buckets.length <= limit) {
    return buckets
  }

  const visibleCount = Math.max(limit - 1, 0)
  const visibleBuckets = buckets.slice(0, visibleCount)
  const otherCount = buckets
    .slice(visibleCount)
    .reduce((sum, bucket) => sum + bucket.count, 0)

  return [
    ...visibleBuckets,
    { label: "Other", count: otherCount, isOther: true },
  ]
}

function getTimeBuckets(
  source: Device[],
  field: DeviceChartField,
  interval: ChartInterval,
  limit: number,
  timeZone: string
): TimeChartBucket[] {
  const offsetMinutes = parseTimeZoneOffsetMinutes(timeZone)
  const intervalMs = getIntervalMilliseconds(interval)
  const latestTime = Math.max(
    ...source.map((device) => new Date(String(device[field])).getTime())
  )
  const latestBucketStart = getTimeBucketStart(
    new Date(latestTime),
    interval,
    offsetMinutes
  )

  return Array.from({ length: limit }, (_, index) => {
    const startTime = new Date(latestBucketStart.getTime() - index * intervalMs)
    const endTime = new Date(startTime.getTime() + intervalMs - 1)

    return {
      startTime: formatDateTimeWithOffset(startTime, offsetMinutes),
      endTime: formatDateTimeWithOffset(endTime, offsetMinutes),
      label: formatDateLabel(startTime, interval, offsetMinutes),
      count: source.filter((device) => {
        const time = new Date(String(device[field])).getTime()

        return time >= startTime.getTime() && time <= endTime.getTime()
      }).length,
    }
  })
}

function getIntervalMilliseconds(interval: ChartInterval) {
  switch (interval) {
    case "second":
      return MILLISECONDS_PER_SECOND
    case "minute":
      return MILLISECONDS_PER_MINUTE
    case "hour":
      return MILLISECONDS_PER_HOUR
    case "week":
      return 7 * MILLISECONDS_PER_DAY
    case "month":
      return 30 * MILLISECONDS_PER_DAY
    case "year":
      return 365 * MILLISECONDS_PER_DAY
    case "day":
    default:
      return MILLISECONDS_PER_DAY
  }
}

function parseTimeZoneOffsetMinutes(timeZone: string) {
  const match = /^([+-])(\d{2}):(\d{2})$/.exec(timeZone)

  if (!match) {
    return 0
  }

  const [, sign, hours, minutes] = match
  const value = Number(hours) * 60 + Number(minutes)

  return sign === "-" ? -value : value
}

function getTimeBucketStart(
  date: Date,
  interval: ChartInterval,
  offsetMinutes: number
) {
  const localDate = new Date(date.getTime() + offsetMinutes * 60 * 1000)

  if (interval === "second") {
    return new Date(Math.floor(date.getTime() / 1000) * 1000)
  }

  if (interval === "minute") {
    return new Date(
      Math.floor(date.getTime() / MILLISECONDS_PER_MINUTE) *
        MILLISECONDS_PER_MINUTE
    )
  }

  if (interval === "hour") {
    return new Date(
      Math.floor(date.getTime() / MILLISECONDS_PER_HOUR) * MILLISECONDS_PER_HOUR
    )
  }

  const start = Date.UTC(
    localDate.getUTCFullYear(),
    interval === "year" ? 0 : localDate.getUTCMonth(),
    interval === "month" || interval === "year" ? 1 : localDate.getUTCDate()
  )
  const localStart = new Date(start)

  if (interval === "week") {
    return new Date(
      localStart.getTime() -
        localStart.getUTCDay() * MILLISECONDS_PER_DAY -
        offsetMinutes * 60 * 1000
    )
  }

  return new Date(localStart.getTime() - offsetMinutes * 60 * 1000)
}

function formatDateTimeWithOffset(date: Date, offsetMinutes: number) {
  const localDate = new Date(date.getTime() + offsetMinutes * 60 * 1000)
  const offsetSign = offsetMinutes < 0 ? "-" : "+"
  const absoluteOffsetMinutes = Math.abs(offsetMinutes)
  const offsetHours = String(Math.floor(absoluteOffsetMinutes / 60)).padStart(
    2,
    "0"
  )
  const offsetRemainingMinutes = String(absoluteOffsetMinutes % 60).padStart(
    2,
    "0"
  )

  return `${localDate.toISOString().replace("Z", "")}${offsetSign}${offsetHours}:${offsetRemainingMinutes}`
}

function formatDateLabel(
  date: Date,
  interval: ChartInterval,
  offsetMinutes: number
) {
  const localDate = new Date(date.getTime() + offsetMinutes * 60 * 1000)
  const dateLabel = localDate.toISOString().slice(0, 10)

  return interval === "week" ? `Week of ${dateLabel}` : dateLabel
}

const chartPreferences: DeviceChartPreferencesResult = {
  charts: [
    {
      id: "0",
      chartType: "donut",
      query: {
        field: "deviceType",
        limit: 5,
      },
    },
    {
      id: "1",
      chartType: "bar",
      query: {
        field: "lastConnectionStatusChange",
        limit: 7,
        interval: "day",
        timeZone: "+09:00",
      },
    },
  ],
}

const devices: Device[] = [
  {
    id: "1",
    deviceName: "Seoul-OUT-XL5-40CT-001",
    deviceType: "Bixolon XL Printer Series v4",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-14T08:20:00.000Z",
    groups: ["Seoul DC - Outbound"],
    groupPaths: ["/My Company/Korea Operations/Seoul DC/Outbound"],
    activeProtocol: "SOTI MQTT",
    supportedProtocols: ["SOTI MQTT", "HTTPS"],
    protocolAdapter: "Cloud-KR-PRN-MQTT-PA",
    protocolInstance: "mqtt-printer-seoul-outbound",
    activeIpAddress: "10.40.10.21",
  },
  {
    id: "2",
    deviceName: "Seoul-OUT-XD7-20D-002",
    deviceType: "Bixolon XD7 Printer Series v4",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-14T01:45:00.000Z",
    groups: ["Seoul DC - Outbound"],
    groupPaths: ["/My Company/Korea Operations/Seoul DC/Outbound"],
    activeProtocol: "SOTI MQTT",
    supportedProtocols: ["SOTI MQTT", "HTTPS"],
    protocolAdapter: "Cloud-KR-PRN-MQTT-PA",
    protocolInstance: "mqtt-printer-seoul-outbound",
    activeIpAddress: "10.40.10.22",
  },
  {
    id: "3",
    deviceName: "Seoul-IN-SRP-S300II-003",
    deviceType: "Bixolon SRP Printer Series v2",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-13T22:10:00.000Z",
    groups: ["Seoul DC - Receiving"],
    groupPaths: ["/My Company/Korea Operations/Seoul DC/Receiving"],
    activeProtocol: "HTTPS",
    supportedProtocols: ["HTTPS", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-PRN-HTTPS-PA",
    protocolInstance: "https-printer-seoul-receiving",
    activeIpAddress: "10.40.11.23",
  },
  {
    id: "4",
    deviceName: "Seoul-IN-RK95-004",
    deviceType: "Barcode Scanner",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-13T14:32:00.000Z",
    groups: ["Seoul DC - Receiving"],
    groupPaths: ["/My Company/Korea Operations/Seoul DC/Receiving"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-scanners",
    activeIpAddress: "10.40.11.24",
  },
  {
    id: "5",
    deviceName: "Seoul-PACK-TAB-ACTIVE5-005",
    deviceType: "Rugged Tablet",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-12T09:05:00.000Z",
    groups: ["Seoul DC - Packing"],
    groupPaths: ["/My Company/Korea Operations/Seoul DC/Packing"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-tablets",
    activeIpAddress: "10.40.12.25",
  },
  {
    id: "6",
    deviceName: "Seoul-PACK-PM45-006",
    deviceType: "Honeywell Label Printer",
    complianceStatus: "Pending",
    deviceState: "Yellow",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-12T03:48:00.000Z",
    groups: ["Seoul DC - Packing"],
    groupPaths: ["/My Company/Korea Operations/Seoul DC/Packing"],
    activeProtocol: "SNMP",
    supportedProtocols: ["SNMP", "HTTPS"],
    protocolAdapter: "Cloud-KR-PRN-SNMP-PA",
    protocolInstance: "snmp-printer-health",
    activeIpAddress: "10.40.12.26",
  },
  {
    id: "7",
    deviceName: "Seoul-QA-MEMOR12-007",
    deviceType: "Mobile Computer",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-11T18:22:00.000Z",
    groups: ["Seoul DC - QA"],
    groupPaths: ["/My Company/Korea Operations/Seoul DC/QA"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-handhelds",
    activeIpAddress: "10.40.13.27",
  },
  {
    id: "8",
    deviceName: "Seoul-QA-XM7-40R-008",
    deviceType: "Bixolon XM7 Printer Series v4",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-10T11:16:00.000Z",
    groups: ["Seoul DC - QA"],
    groupPaths: ["/My Company/Korea Operations/Seoul DC/QA"],
    activeProtocol: "Bluetooth",
    supportedProtocols: ["Bluetooth", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-PRN-BT-PA",
    protocolInstance: "bt-mobile-printer",
    activeIpAddress: "10.40.13.28",
  },
  {
    id: "9",
    deviceName: "Busan-OUT-ZT411-009",
    deviceType: "Zebra Industrial Printer",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-09T07:40:00.000Z",
    groups: ["Busan DC - Outbound"],
    groupPaths: ["/My Company/Korea Operations/Busan DC/Outbound"],
    activeProtocol: "Zebra Link-OS",
    supportedProtocols: ["Zebra Link-OS", "HTTPS"],
    protocolAdapter: "Cloud-KR-LINKOS-PA",
    protocolInstance: "linkos-industrial-printers",
    activeIpAddress: "10.41.10.31",
  },
  {
    id: "10",
    deviceName: "Busan-OUT-XL5-40CT-010",
    deviceType: "Bixolon XL Printer Series v4",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-08T23:55:00.000Z",
    groups: ["Busan DC - Outbound"],
    groupPaths: ["/My Company/Korea Operations/Busan DC/Outbound"],
    activeProtocol: "SOTI MQTT",
    supportedProtocols: ["SOTI MQTT", "HTTPS"],
    protocolAdapter: "Cloud-KR-PRN-MQTT-PA",
    protocolInstance: "mqtt-printer-busan-outbound",
    activeIpAddress: "10.41.10.32",
  },
  {
    id: "11",
    deviceName: "Busan-IN-RK95-011",
    deviceType: "Barcode Scanner",
    complianceStatus: "Compliant",
    deviceState: "Yellow",
    connectionStatus: "GatewayNotAvailable",
    lastConnectionStatusChange: "2026-05-07T04:12:00.000Z",
    groups: ["Busan DC - Receiving"],
    groupPaths: ["/My Company/Korea Operations/Busan DC/Receiving"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-scanners",
    activeIpAddress: "10.41.11.33",
  },
  {
    id: "12",
    deviceName: "Busan-IN-SRP-S300II-012",
    deviceType: "Bixolon SRP Printer Series v2",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-06T16:25:00.000Z",
    groups: ["Busan DC - Receiving"],
    groupPaths: ["/My Company/Korea Operations/Busan DC/Receiving"],
    activeProtocol: "HTTPS",
    supportedProtocols: ["HTTPS", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-PRN-HTTPS-PA",
    protocolInstance: "https-printer-busan-receiving",
    activeIpAddress: "10.41.11.34",
  },
  {
    id: "13",
    deviceName: "Busan-PACK-TAB-ACTIVE5-013",
    deviceType: "Rugged Tablet",
    complianceStatus: "Pending",
    deviceState: "Yellow",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-05T08:33:00.000Z",
    groups: ["Busan DC - Packing"],
    groupPaths: ["/My Company/Korea Operations/Busan DC/Packing"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-tablets",
    activeIpAddress: "10.41.12.35",
  },
  {
    id: "14",
    deviceName: "Busan-PACK-PM45-014",
    deviceType: "Honeywell Label Printer",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "ConnectionPending",
    lastConnectionStatusChange: "2026-05-04T21:18:00.000Z",
    groups: ["Busan DC - Packing"],
    groupPaths: ["/My Company/Korea Operations/Busan DC/Packing"],
    activeProtocol: "SNMP",
    supportedProtocols: ["SNMP", "HTTPS"],
    protocolAdapter: "Cloud-KR-PRN-SNMP-PA",
    protocolInstance: "snmp-printer-health",
    activeIpAddress: "10.41.12.36",
  },
  {
    id: "15",
    deviceName: "Incheon-RET-KIOSK-015",
    deviceType: "Android Kiosk",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-03T12:02:00.000Z",
    groups: ["Incheon Retail - Front"],
    groupPaths: ["/My Company/Korea Retail/Incheon/Front"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-kiosks",
    activeIpAddress: "10.42.20.41",
  },
  {
    id: "16",
    deviceName: "Incheon-RET-SPP-L410-016",
    deviceType: "Mobile Printer",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-02T05:44:00.000Z",
    groups: ["Incheon Retail - Front"],
    groupPaths: ["/My Company/Korea Retail/Incheon/Front"],
    activeProtocol: "Bluetooth",
    supportedProtocols: ["Bluetooth", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-PRN-BT-PA",
    protocolInstance: "bt-mobile-printer",
    activeIpAddress: "10.42.20.42",
  },
  {
    id: "17",
    deviceName: "Incheon-STOCK-MEMOR12-017",
    deviceType: "Mobile Computer",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-05-01T19:30:00.000Z",
    groups: ["Incheon Retail - Stockroom"],
    groupPaths: ["/My Company/Korea Retail/Incheon/Stockroom"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-handhelds",
    activeIpAddress: "10.42.21.43",
  },
  {
    id: "18",
    deviceName: "Incheon-STOCK-XD7-20D-018",
    deviceType: "Bixolon XD7 Printer Series v4",
    complianceStatus: "NonCompliant",
    deviceState: "Red",
    connectionStatus: "DeviceUnreachable",
    lastConnectionStatusChange: "2026-04-30T02:20:00.000Z",
    groups: ["Incheon Retail - Stockroom"],
    groupPaths: ["/My Company/Korea Retail/Incheon/Stockroom"],
    activeProtocol: "SOTI MQTT",
    supportedProtocols: ["SOTI MQTT", "HTTPS"],
    protocolAdapter: "Cloud-KR-PRN-MQTT-PA",
    protocolInstance: "mqtt-printer-retail",
    activeIpAddress: "",
  },
  {
    id: "19",
    deviceName: "Daejeon-SVC-RELAY-019",
    deviceType: "SOTI Gateway",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-04-29T13:11:00.000Z",
    groups: ["Daejeon Service Center"],
    groupPaths: ["/My Company/Korea Operations/Daejeon Service Center"],
    activeProtocol: "HTTPS",
    supportedProtocols: ["HTTPS", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-GW-HTTPS-PA",
    protocolInstance: "gateway-daejeon-service",
    activeIpAddress: "10.43.30.51",
  },
  {
    id: "20",
    deviceName: "Daejeon-SVC-PM45-020",
    deviceType: "Honeywell Label Printer",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-04-28T06:57:00.000Z",
    groups: ["Daejeon Service Center"],
    groupPaths: ["/My Company/Korea Operations/Daejeon Service Center"],
    activeProtocol: "SNMP",
    supportedProtocols: ["SNMP", "HTTPS"],
    protocolAdapter: "Cloud-KR-PRN-SNMP-PA",
    protocolInstance: "snmp-printer-health",
    activeIpAddress: "10.43.30.52",
  },
  {
    id: "21",
    deviceName: "Daejeon-SVC-RK95-021",
    deviceType: "Barcode Scanner",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-04-26T22:04:00.000Z",
    groups: ["Daejeon Service Center"],
    groupPaths: ["/My Company/Korea Operations/Daejeon Service Center"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-scanners",
    activeIpAddress: "10.43.30.53",
  },
  {
    id: "22",
    deviceName: "Daegu-RET-KIOSK-022",
    deviceType: "Android Kiosk",
    complianceStatus: "Pending",
    deviceState: "Yellow",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-04-25T10:40:00.000Z",
    groups: ["Daegu Retail - Front"],
    groupPaths: ["/My Company/Korea Retail/Daegu/Front"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-kiosks",
    activeIpAddress: "10.44.20.61",
  },
  {
    id: "23",
    deviceName: "Daegu-RET-SPP-L410-023",
    deviceType: "Mobile Printer",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "NetworkUnknown",
    lastConnectionStatusChange: "2026-04-23T03:19:00.000Z",
    groups: ["Daegu Retail - Front"],
    groupPaths: ["/My Company/Korea Retail/Daegu/Front"],
    activeProtocol: "Bluetooth",
    supportedProtocols: ["Bluetooth", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-PRN-BT-PA",
    protocolInstance: "bt-mobile-printer",
    activeIpAddress: "10.44.20.62",
  },
  {
    id: "24",
    deviceName: "Daegu-STOCK-MEMOR12-024",
    deviceType: "Mobile Computer",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-04-21T15:08:00.000Z",
    groups: ["Daegu Retail - Stockroom"],
    groupPaths: ["/My Company/Korea Retail/Daegu/Stockroom"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-handhelds",
    activeIpAddress: "10.44.21.63",
  },
  {
    id: "25",
    deviceName: "Gwangju-RET-KIOSK-025",
    deviceType: "Android Kiosk",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-04-19T09:52:00.000Z",
    groups: ["Gwangju Retail - Front"],
    groupPaths: ["/My Company/Korea Retail/Gwangju/Front"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-kiosks",
    activeIpAddress: "10.45.20.71",
  },
  {
    id: "26",
    deviceName: "Gwangju-RET-XM7-40R-026",
    deviceType: "Bixolon XM7 Printer Series v4",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-04-17T21:37:00.000Z",
    groups: ["Gwangju Retail - Front"],
    groupPaths: ["/My Company/Korea Retail/Gwangju/Front"],
    activeProtocol: "Bluetooth",
    supportedProtocols: ["Bluetooth", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-PRN-BT-PA",
    protocolInstance: "bt-mobile-printer",
    activeIpAddress: "10.45.20.72",
  },
  {
    id: "27",
    deviceName: "Gwangju-STOCK-RK95-027",
    deviceType: "Barcode Scanner",
    complianceStatus: "Compliant",
    deviceState: "Yellow",
    connectionStatus: "GatewayNotAvailable",
    lastConnectionStatusChange: "2026-04-15T05:14:00.000Z",
    groups: ["Gwangju Retail - Stockroom"],
    groupPaths: ["/My Company/Korea Retail/Gwangju/Stockroom"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-scanners",
    activeIpAddress: "10.45.21.73",
  },
  {
    id: "28",
    deviceName: "Suwon-QA-TAB-ACTIVE5-028",
    deviceType: "Rugged Tablet",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-04-12T18:49:00.000Z",
    groups: ["Suwon QA Lab"],
    groupPaths: ["/My Company/Korea Operations/Suwon QA Lab"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-tablets",
    activeIpAddress: "10.46.40.81",
  },
  {
    id: "29",
    deviceName: "Suwon-QA-ZT411-029",
    deviceType: "Zebra Industrial Printer",
    complianceStatus: "Pending",
    deviceState: "Yellow",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-04-10T11:03:00.000Z",
    groups: ["Suwon QA Lab"],
    groupPaths: ["/My Company/Korea Operations/Suwon QA Lab"],
    activeProtocol: "Zebra Link-OS",
    supportedProtocols: ["Zebra Link-OS", "HTTPS"],
    protocolAdapter: "Cloud-KR-LINKOS-PA",
    protocolInstance: "linkos-industrial-printers",
    activeIpAddress: "10.46.40.82",
  },
  {
    id: "30",
    deviceName: "Suwon-QA-MEMOR12-030",
    deviceType: "Mobile Computer",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-04-08T00:27:00.000Z",
    groups: ["Suwon QA Lab"],
    groupPaths: ["/My Company/Korea Operations/Suwon QA Lab"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-handhelds",
    activeIpAddress: "10.46.40.83",
  },
  {
    id: "31",
    deviceName: "Ulsan-MFG-SCALE-031",
    deviceType: "Warehouse Scale",
    complianceStatus: "NotApplicable",
    deviceState: "Gray",
    connectionStatus: "DeviceOffline",
    lastConnectionStatusChange: "2026-04-05T14:42:00.000Z",
    groups: ["Ulsan Manufacturing - Line 1"],
    groupPaths: ["/My Company/Korea Manufacturing/Ulsan/Line 1"],
    activeProtocol: "SNMP",
    supportedProtocols: ["SNMP", "HTTPS"],
    protocolAdapter: "Cloud-KR-IOT-SNMP-PA",
    protocolInstance: "snmp-industrial-equipment",
    activeIpAddress: "",
  },
  {
    id: "32",
    deviceName: "Ulsan-MFG-XL5-40CT-032",
    deviceType: "Bixolon XL Printer Series v4",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-04-02T08:19:00.000Z",
    groups: ["Ulsan Manufacturing - Line 1"],
    groupPaths: ["/My Company/Korea Manufacturing/Ulsan/Line 1"],
    activeProtocol: "SOTI MQTT",
    supportedProtocols: ["SOTI MQTT", "HTTPS"],
    protocolAdapter: "Cloud-KR-PRN-MQTT-PA",
    protocolInstance: "mqtt-printer-manufacturing",
    activeIpAddress: "10.47.50.91",
  },
  {
    id: "33",
    deviceName: "Ulsan-MFG-TAB-ACTIVE5-033",
    deviceType: "Rugged Tablet",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-03-30T23:56:00.000Z",
    groups: ["Ulsan Manufacturing - Line 2"],
    groupPaths: ["/My Company/Korea Manufacturing/Ulsan/Line 2"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-tablets",
    activeIpAddress: "10.47.51.92",
  },
  {
    id: "34",
    deviceName: "Ulsan-MFG-XD7-20D-034",
    deviceType: "Bixolon XD7 Printer Series v4",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "ConnectionPending",
    lastConnectionStatusChange: "2026-03-27T17:31:00.000Z",
    groups: ["Ulsan Manufacturing - Line 2"],
    groupPaths: ["/My Company/Korea Manufacturing/Ulsan/Line 2"],
    activeProtocol: "HTTPS",
    supportedProtocols: ["HTTPS", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-PRN-HTTPS-PA",
    protocolInstance: "https-printer-manufacturing",
    activeIpAddress: "10.47.51.93",
  },
  {
    id: "35",
    deviceName: "Jeju-RET-KIOSK-035",
    deviceType: "Android Kiosk",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-03-24T06:15:00.000Z",
    groups: ["Jeju Retail - Front"],
    groupPaths: ["/My Company/Korea Retail/Jeju/Front"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-kiosks",
    activeIpAddress: "10.48.20.101",
  },
  {
    id: "36",
    deviceName: "Jeju-RET-SPP-L410-036",
    deviceType: "Mobile Printer",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-03-20T20:08:00.000Z",
    groups: ["Jeju Retail - Front"],
    groupPaths: ["/My Company/Korea Retail/Jeju/Front"],
    activeProtocol: "Bluetooth",
    supportedProtocols: ["Bluetooth", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-PRN-BT-PA",
    protocolInstance: "bt-mobile-printer",
    activeIpAddress: "10.48.20.102",
  },
  {
    id: "37",
    deviceName: "Jeju-STOCK-MEMOR12-037",
    deviceType: "Mobile Computer",
    complianceStatus: "Pending",
    deviceState: "Yellow",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-03-16T12:46:00.000Z",
    groups: ["Jeju Retail - Stockroom"],
    groupPaths: ["/My Company/Korea Retail/Jeju/Stockroom"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-handhelds",
    activeIpAddress: "10.48.21.103",
  },
  {
    id: "38",
    deviceName: "Field-SVC-TAB-ACTIVE5-038",
    deviceType: "Rugged Tablet",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-03-12T01:24:00.000Z",
    groups: ["Field Service"],
    groupPaths: ["/My Company/Korea Operations/Field Service"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-field-service",
    activeIpAddress: "10.49.60.111",
  },
  {
    id: "39",
    deviceName: "Field-SVC-SPP-L410-039",
    deviceType: "Mobile Printer",
    complianceStatus: "NonCompliant",
    deviceState: "Red",
    connectionStatus: "DeviceUnreachable",
    lastConnectionStatusChange: "2026-03-07T19:09:00.000Z",
    groups: ["Field Service"],
    groupPaths: ["/My Company/Korea Operations/Field Service"],
    activeProtocol: "Bluetooth",
    supportedProtocols: ["Bluetooth", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-PRN-BT-PA",
    protocolInstance: "bt-mobile-printer",
    activeIpAddress: "",
  },
  {
    id: "40",
    deviceName: "Field-SVC-RK95-040",
    deviceType: "Barcode Scanner",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-03-03T04:58:00.000Z",
    groups: ["Field Service"],
    groupPaths: ["/My Company/Korea Operations/Field Service"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-scanners",
    activeIpAddress: "10.49.60.113",
  },
  {
    id: "41",
    deviceName: "Spare-Pool-XL5-40CT-041",
    deviceType: "Bixolon XL Printer Series v4",
    complianceStatus: "NotApplicable",
    deviceState: "Gray",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-02-26T16:36:00.000Z",
    groups: ["Spare Pool"],
    groupPaths: ["/My Company/Korea Operations/Spare Pool"],
    activeProtocol: "SOTI MQTT",
    supportedProtocols: ["SOTI MQTT", "HTTPS"],
    protocolAdapter: "Cloud-KR-PRN-MQTT-PA",
    protocolInstance: "mqtt-printer-spares",
    activeIpAddress: "10.50.70.121",
  },
  {
    id: "42",
    deviceName: "Spare-Pool-XD7-20D-042",
    deviceType: "Bixolon XD7 Printer Series v4",
    complianceStatus: "NotApplicable",
    deviceState: "Gray",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-02-21T09:22:00.000Z",
    groups: ["Spare Pool"],
    groupPaths: ["/My Company/Korea Operations/Spare Pool"],
    activeProtocol: "HTTPS",
    supportedProtocols: ["HTTPS", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-PRN-HTTPS-PA",
    protocolInstance: "https-printer-spares",
    activeIpAddress: "10.50.70.122",
  },
  {
    id: "43",
    deviceName: "NOC-GW-RELAY-043",
    deviceType: "SOTI Gateway",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-02-15T23:40:00.000Z",
    groups: ["Network Operations"],
    groupPaths: ["/My Company/Korea Operations/Network Operations"],
    activeProtocol: "HTTPS",
    supportedProtocols: ["HTTPS", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-GW-HTTPS-PA",
    protocolInstance: "gateway-network-operations",
    activeIpAddress: "10.51.80.131",
  },
  {
    id: "44",
    deviceName: "NOC-GW-RELAY-044",
    deviceType: "SOTI Gateway",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-02-09T13:17:00.000Z",
    groups: ["Network Operations"],
    groupPaths: ["/My Company/Korea Operations/Network Operations"],
    activeProtocol: "HTTPS",
    supportedProtocols: ["HTTPS", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-GW-HTTPS-PA",
    protocolInstance: "gateway-network-operations",
    activeIpAddress: "10.51.80.132",
  },
  {
    id: "45",
    deviceName: "NOC-MON-SCALE-045",
    deviceType: "Warehouse Scale",
    complianceStatus: "Pending",
    deviceState: "Yellow",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-02-03T02:05:00.000Z",
    groups: ["Network Operations"],
    groupPaths: ["/My Company/Korea Operations/Network Operations"],
    activeProtocol: "SNMP",
    supportedProtocols: ["SNMP", "HTTPS"],
    protocolAdapter: "Cloud-KR-IOT-SNMP-PA",
    protocolInstance: "snmp-industrial-equipment",
    activeIpAddress: "10.51.80.133",
  },
  {
    id: "46",
    deviceName: "Seoul-OUT-ZT411-046",
    deviceType: "Zebra Industrial Printer",
    complianceStatus: "Compliant",
    deviceState: "Yellow",
    connectionStatus: "GatewayNotAvailable",
    lastConnectionStatusChange: "2026-01-27T18:51:00.000Z",
    groups: ["Seoul DC - Outbound"],
    groupPaths: ["/My Company/Korea Operations/Seoul DC/Outbound"],
    activeProtocol: "Zebra Link-OS",
    supportedProtocols: ["Zebra Link-OS", "HTTPS"],
    protocolAdapter: "Cloud-KR-LINKOS-PA",
    protocolInstance: "linkos-industrial-printers",
    activeIpAddress: "10.40.10.46",
  },
  {
    id: "47",
    deviceName: "Busan-PACK-XM7-40R-047",
    deviceType: "Bixolon XM7 Printer Series v4",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2026-01-18T07:34:00.000Z",
    groups: ["Busan DC - Packing"],
    groupPaths: ["/My Company/Korea Operations/Busan DC/Packing"],
    activeProtocol: "Bluetooth",
    supportedProtocols: ["Bluetooth", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-PRN-BT-PA",
    protocolInstance: "bt-mobile-printer",
    activeIpAddress: "10.41.12.47",
  },
  {
    id: "48",
    deviceName: "Incheon-STOCK-TAB-ACTIVE5-048",
    deviceType: "Rugged Tablet",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "ConnectionPending",
    lastConnectionStatusChange: "2026-01-08T22:12:00.000Z",
    groups: ["Incheon Retail - Stockroom"],
    groupPaths: ["/My Company/Korea Retail/Incheon/Stockroom"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "SOTI MQTT"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-tablets",
    activeIpAddress: "10.42.21.48",
  },
  {
    id: "49",
    deviceName: "Daegu-STOCK-ZT411-049",
    deviceType: "Zebra Industrial Printer",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2025-12-21T11:29:00.000Z",
    groups: ["Daegu Retail - Stockroom"],
    groupPaths: ["/My Company/Korea Retail/Daegu/Stockroom"],
    activeProtocol: "Zebra Link-OS",
    supportedProtocols: ["Zebra Link-OS", "HTTPS"],
    protocolAdapter: "Cloud-KR-LINKOS-PA",
    protocolInstance: "linkos-retail-printers",
    activeIpAddress: "10.44.21.49",
  },
  {
    id: "50",
    deviceName: "Jeju-RET-RK95-050",
    deviceType: "Barcode Scanner",
    complianceStatus: "Compliant",
    deviceState: "Green",
    connectionStatus: "DeviceOnline",
    lastConnectionStatusChange: "2025-11-30T04:44:00.000Z",
    groups: ["Jeju Retail - Front"],
    groupPaths: ["/My Company/Korea Retail/Jeju/Front"],
    activeProtocol: "Android Enterprise",
    supportedProtocols: ["Android Enterprise", "HTTPS"],
    protocolAdapter: "Cloud-KR-AE-PA",
    protocolInstance: "android-enterprise-scanners",
    activeIpAddress: "10.48.20.150",
  },
]

export const devicesHandlers = [
  http.get(DEVICES_API_PATH, async ({ request }) => {
    await delay(1000)

    return HttpResponse.json(getPaginatedDevices(request, devices))
  }),

  http.get(DEVICE_CHART_PREFERENCES_API_PATH, async () => {
    await delay(500)

    return HttpResponse.json(chartPreferences)
  }),

  http.post(DEVICE_CHARTS_QUERY_API_PATH, async ({ request }) => {
    await delay(500)

    const payload = parseDeviceChartsQueryRequest(await request.json())

    if (!payload) {
      return HttpResponse.json(
        { message: "Invalid device charts query" },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      charts: payload.charts.map((chart) => getDeviceChartData(chart, devices)),
    })
  }),
]
