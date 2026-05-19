import type { Option } from "@/base/model/types"

export type DeviceComplianceStatus =
  | "Compliant"
  | "NonCompliant"
  | "Pending"
  | "NotApplicable"

export const DEVICE_COMPLIANCE_STATUS_OPTIONS: Option<DeviceComplianceStatus>[] =
  [
    { label: "Compliant", value: "Compliant" },
    { label: "Non-compliant", value: "NonCompliant" },
    { label: "Pending", value: "Pending" },
    { label: "Not applicable", value: "NotApplicable" },
  ]

export type DeviceState = "Green" | "Yellow" | "Red" | "Gray"
export const DEVICE_STATE_OPTIONS: Option<DeviceState>[] = [
  { label: "Green", value: "Green" },
  { label: "Yellow", value: "Yellow" },
  { label: "Red", value: "Red" },
  { label: "Gray", value: "Gray" },
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
    },
    { label: "Device Offline", value: "DeviceOffline" },
    { label: "Device Online", value: "DeviceOnline" },
    {
      label: "Device Unreachable",
      value: "DeviceUnreachable",
    },
    {
      label: "Gateway Not Available",
      value: "GatewayNotAvailable",
    },
    { label: "Network Unknown", value: "NetworkUnknown" },
  ]
