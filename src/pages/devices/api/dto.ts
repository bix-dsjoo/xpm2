import type {
  PaginatedResponse,
  PaginationParams,
} from "@/base/model/pagination"

import type { Device } from "../model/types"

export type FetchDevicesResponse = PaginatedResponse<Device>

export type FetchDevicesRequest = PaginationParams & {
  signal?: AbortSignal
}
