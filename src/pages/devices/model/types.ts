import type {
  DeviceComplianceStatus,
  DeviceConnectionStatus,
  DeviceState,
} from "./enums"

export type Device = {
  id: string
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
