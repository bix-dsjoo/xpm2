import type { PaginatedList, PaginationParams } from "@/base/model/pagination"

import type { Device } from "../model/types"

export type FetchDevicesResponse = PaginatedList<Device>

export type FetchDevicesRequest = PaginationParams & {
  signal?: AbortSignal
}
