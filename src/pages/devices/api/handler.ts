import { delay, http, HttpResponse } from "msw"

import { DEVICES_API_PATH } from "./api"
import type { Device } from "../model/types"

const devices: Device[] = [
  {
    id: "device-001",
    deviceType: "PLC",
    deviceState: "normal",
    deviceConnectionStatus: "connected",
    groups: ["Production", "Line 1"],
    groupPaths: ["/factory-a/production/line-1"],
    activeProtocol: "Modbus TCP",
    supportedProtocols: ["Modbus TCP", "OPC UA"],
    protocolAdapter: "modbus-adapter",
    protocolInstance: "modbus-line-1",
    activeIpAddress: "10.20.1.11",
  },
  {
    id: "device-002",
    deviceType: "Robot Controller",
    deviceState: "warning",
    deviceConnectionStatus: "connected",
    groups: ["Assembly", "Robotics"],
    groupPaths: ["/factory-a/assembly/robotics"],
    activeProtocol: "OPC UA",
    supportedProtocols: ["OPC UA", "EtherNet/IP"],
    protocolAdapter: "opcua-adapter",
    protocolInstance: "opcua-assembly-a",
    activeIpAddress: "10.20.2.24",
  },
  {
    id: "device-003",
    deviceType: "Sensor Gateway",
    deviceState: "offline",
    deviceConnectionStatus: "disconnected",
    groups: ["Utilities", "Environment"],
    groupPaths: ["/factory-a/utilities/environment"],
    activeProtocol: "MQTT",
    supportedProtocols: ["MQTT", "HTTP"],
    protocolAdapter: "mqtt-adapter",
    protocolInstance: "mqtt-env-gateway",
    activeIpAddress: "10.20.3.8",
  },
  {
    id: "device-004",
    deviceType: "HMI",
    deviceState: "normal",
    deviceConnectionStatus: "connecting",
    groups: ["Packaging", "Operator Stations"],
    groupPaths: ["/factory-b/packaging/operator-stations"],
    activeProtocol: "HTTP",
    supportedProtocols: ["HTTP", "WebSocket"],
    protocolAdapter: "http-adapter",
    protocolInstance: "http-packaging-hmi",
    activeIpAddress: "10.30.4.15",
  },
  {
    id: "device-005",
    deviceType: "Drive",
    deviceState: "error",
    deviceConnectionStatus: "connected",
    groups: ["Material Handling", "Conveyors"],
    groupPaths: ["/factory-b/material-handling/conveyors"],
    activeProtocol: "EtherNet/IP",
    supportedProtocols: ["EtherNet/IP", "Modbus TCP"],
    protocolAdapter: "ethernet-ip-adapter",
    protocolInstance: "enip-conveyor-3",
    activeIpAddress: "10.30.5.31",
  },
]

export const devicesHandlers = [
  http.get(DEVICES_API_PATH, async () => {
    await delay(1000)

    return HttpResponse.json(devices)
  }),
]
