import type { Option } from "@/base/model/types"

export type Device = {
  deviceId: string
  deviceName: string
  deviceType: string
  complianceStatus: DeviceComplianceStatus
  deviceState: DeviceState
  connectionStatus: DeviceConnectionStatus
  lastConnectionStatusChange: string
  groups: string[]
  groupPaths: string[]
  activeProtocol: string
  supportedProtocols: string[]
  protocolAdapter: string
  protocolInstance: string
  activeIpAddress: string
}

export type DevicesResponse = {
  data: Device[]
  pagination: DevicesPagination
}

export type DevicesPagination = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type DeviceComplianceStatus =
  | "Compliant"
  | "NonCompliant"
  | "Pending"
  | "NotApplicable"

export const DEVICE_COMPLIANCE_STATUS_OPTIONS: Option<DeviceComplianceStatus>[] =
  [
    { label: "Compliant", value: "Compliant", variant: "success" },
    { label: "Non-compliant", value: "NonCompliant", variant: "destructive" },
    { label: "Pending", value: "Pending", variant: "warning" },
    { label: "Not applicable", value: "NotApplicable", variant: "neutral" },
  ]

export type DeviceState = "Green" | "Yellow" | "Red" | "Gray"
export const DEVICE_STATE_OPTIONS: Option<DeviceState>[] = [
  { label: "Green", value: "Green", variant: "success" },
  { label: "Yellow", value: "Yellow", variant: "warning" },
  { label: "Red", value: "Red", variant: "destructive" },
  { label: "Gray", value: "Gray", variant: "neutral" },
]

export type DeviceConnectionStatus =
  | "ConnectionPending"
  | "DeviceOffline"
  | "DeviceOnline"
  | "DeviceUnreachable"
  | "GatewayNotAvailable"
  | "NetworkUnknown"

export const DEVICE_CONNECTION_STATUS_OPTIONS: Option<DeviceConnectionStatus>[] =
  [
    {
      label: "Connection Pending",
      value: "ConnectionPending",
      variant: "info",
    },
    { label: "Device Offline", value: "DeviceOffline", variant: "neutral" },
    { label: "Device Online", value: "DeviceOnline", variant: "success" },
    {
      label: "Device Unreachable",
      value: "DeviceUnreachable",
      variant: "destructive",
    },
    {
      label: "Gateway Not Available",
      value: "GatewayNotAvailable",
      variant: "warning",
    },
    { label: "Network Unknown", value: "NetworkUnknown", variant: "secondary" },
  ]
