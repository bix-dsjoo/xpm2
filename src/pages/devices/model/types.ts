export type Device = {
  id: string
  deviceName: string
  deviceType: string
  deviceState: "normal" | "warning" | "error" | "offline"
  deviceConnectionStatus: "connected" | "disconnected" | "connecting"
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
