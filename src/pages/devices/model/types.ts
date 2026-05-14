import type { Option } from "@/base/model/types"

export type Device = {
  id: string
  deviceName: string
  deviceType: string
  deviceState: DeviceState
  deviceConnectionStatus: DeviceConnectionStatus
  groups: string[]
  groupPaths: string[]
  activeProtocol: string
  supportedProtocols: string[]
  protocolAdapter: string
  protocolInstance: string
  activeIpAddress: string
  isManaged: boolean
  alertCount: number
  lastConnectedAt: string
}

export type DeviceState = "normal" | "warning" | "error" | "offline"
export const DEVICE_STATE_OPTIONS: Option<DeviceState>[] = [
  { label: "Normal", value: "normal", color: "green" },
  { label: "Warning", value: "warning", color: "amber" },
  { label: "Error", value: "error", color: "red" },
  { label: "Offline", value: "offline", color: "zinc" },
]

export type DeviceConnectionStatus = "connected" | "disconnected" | "connecting"
export const deviceConnectionStatusOptions: Option<DeviceConnectionStatus>[] = [
  { label: "Connected", value: "connected", color: "green" },
  { label: "Disconnected", value: "disconnected", color: "red" },
  { label: "Connecting", value: "connecting", color: "blue" },
]
